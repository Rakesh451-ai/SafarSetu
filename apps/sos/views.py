import logging

from django.contrib.gis.geos import Point
from django.utils import timezone
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.identity.models import Tourist
from apps.notifications.tasks import fan_out_sos_alert
from apps.tracking.models import LocationPing, ZoneType

from .models import CheckInSchedule, SOSEvent, SOSStatus
from .serializers import (
    CheckInActionSerializer,
    CheckInScheduleSerializer,
    SOSEventResponseSerializer,
    SOSTriggerInputSerializer,
)

logger = logging.getLogger("safarsetu.sos")


@extend_schema(
    tags=["SOS & Emergency Response"],
    summary="Trigger emergency SOS alert",
    description=(
        "Synchronously persists a critical SOSEvent record and immediately enqueues "
        "a high-priority fan-out Celery task on the dedicated 'sos' queue to dispatch "
        "SMS notifications to emergency contacts and stream real-time WebSocket alerts."
    ),
    request=SOSTriggerInputSerializer,
    responses={
        201: SOSEventResponseSerializer,
        400: OpenApiResponse(description="Invalid coordinates or missing tourist ID."),
        404: OpenApiResponse(description="Tourist not found."),
    },
)
class SOSTriggerView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = SOSTriggerInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        tourist_id = serializer.validated_data["tourist_id"]
        latitude = serializer.validated_data["latitude"]
        longitude = serializer.validated_data["longitude"]
        trigger_type = serializer.validated_data["trigger_type"]
        notes = serializer.validated_data.get("notes", "")

        try:
            tourist = Tourist.objects.get(tourist_id=tourist_id)
        except Tourist.DoesNotExist:
            return Response(
                {"detail": f"Tourist with ID '{tourist_id}' not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        location_point = Point(longitude, latitude, srid=4326)

        # 1. Minimal synchronous persistence (no blocking operations inline)
        sos_event = SOSEvent.objects.create(
            tourist=tourist,
            trigger_type=trigger_type,
            location=location_point,
            status=SOSStatus.ACTIVE,
            notes=notes,
            created_at=timezone.now(),
        )

        # Also log location ping
        try:
            LocationPing.objects.create(
                tourist=tourist,
                location=location_point,
                zone_status_at_ping=ZoneType.DANGER,
            )
        except Exception:
            pass

        logger.critical(
            "🚨 [SOS TRIGGERED] Tourist '%s' (%s) triggered SOS at (%.5f, %.5f). SOSEvent ID: %s",
            tourist.name,
            tourist.phone,
            latitude,
            longitude,
            sos_event.sos_id,
        )

        # 2. Enqueue high-priority background fan-out on 'sos' queue
        try:
            fan_out_sos_alert.apply_async(
                args=[str(sos_event.sos_id)],
                queue="sos",
            )
        except Exception as e:
            logger.error("Failed to enqueue fan_out_sos_alert: %s", e)

        return Response(
            SOSEventResponseSerializer(sos_event).data,
            status=status.HTTP_201_CREATED,
        )


@extend_schema(
    tags=["SOS & Emergency Response"],
    summary="Configure automated tourist check-in schedule",
    description="Sets or updates the automated check-in frequency for a tourist.",
    request=CheckInScheduleSerializer,
    responses={
        200: CheckInScheduleSerializer,
        201: CheckInScheduleSerializer,
        400: OpenApiResponse(description="Validation error."),
    },
)
class CheckInScheduleView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = CheckInScheduleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        schedule = serializer.save()
        return Response(
            CheckInScheduleSerializer(schedule).data,
            status=status.HTTP_201_CREATED,
        )


@extend_schema(
    tags=["SOS & Emergency Response"],
    summary="Submit safety check-in",
    description="Tourist marks active check-in, resetting the overdue timer.",
    request=CheckInActionSerializer,
    responses={
        200: OpenApiResponse(description="Check-in acknowledged."),
        404: OpenApiResponse(description="Tourist not found."),
    },
)
class CheckInActionView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = CheckInActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        tourist_id = serializer.validated_data["tourist_id"]
        lat = serializer.validated_data.get("latitude")
        lng = serializer.validated_data.get("longitude")

        try:
            tourist = Tourist.objects.get(tourist_id=tourist_id)
        except Tourist.DoesNotExist:
            return Response(
                {"detail": f"Tourist with ID '{tourist_id}' not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        now = timezone.now()
        schedule, _ = CheckInSchedule.objects.get_or_create(
            tourist=tourist,
            defaults={"expected_interval_minutes": 60, "last_checkin_at": now},
        )
        schedule.last_checkin_at = now
        schedule.save()

        # If coordinates supplied, record ping
        if lat is not None and lng is not None:
            point = Point(lng, lat, srid=4326)
            LocationPing.objects.create(
                tourist=tourist,
                location=point,
                zone_status_at_ping=ZoneType.SAFE,
                timestamp=now,
            )

        return Response(
            {
                "message": f"Check-in received for {tourist.name}. Timer reset.",
                "schedule": CheckInScheduleSerializer(schedule).data,
            },
            status=status.HTTP_200_OK,
        )


@extend_schema(
    tags=["SOS & Emergency Response"],
    summary="List all SOS events",
    description="Retrieve list of all active and past SOS emergency events.",
)
class SOSEventListView(generics.ListAPIView):
    queryset = SOSEvent.objects.all()
    serializer_class = SOSEventResponseSerializer
    permission_classes = [permissions.AllowAny]


@extend_schema(
    tags=["SOS & Emergency Response"],
    summary="Retrieve or acknowledge/resolve SOS event",
    description="Responder details or updates SOS event status (acknowledged, resolved, false_alarm).",
)
class SOSEventDetailView(generics.RetrieveUpdateAPIView):
    queryset = SOSEvent.objects.all()
    serializer_class = SOSEventResponseSerializer
    permission_classes = [permissions.AllowAny]
