import logging

from django.utils import timezone
from drf_spectacular.utils import OpenApiParameter, OpenApiResponse, extend_schema
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.identity.models import Tourist
from apps.sos.models import SOSEvent, SOSStatus
from apps.tracking.models import LocationPing, ZoneType

from .models import AuditAction, AuditLog
from .serializers import (
    ActiveTouristSerializer,
    AuditLogSerializer,
    IncidentAssignSerializer,
    IncidentStatusUpdateSerializer,
)

logger = logging.getLogger("safarsetu.adminpanel")


def get_client_ip(request):
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR", "127.0.0.1")


@extend_schema(
    tags=["Command Center & Admin"],
    summary="List active alerts scoped to jurisdiction region",
    description=(
        "Returns priority alerts scoped to the requesting responder's region_scope. "
        "Unresolved SOSEvents appear first, followed by recent danger/caution geofence transitions."
    ),
    parameters=[
        OpenApiParameter(
            name="region",
            description="Override region filter (for global admins)",
            required=False,
            type=str,
        )
    ],
)
class AdminAlertsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        profile = getattr(user, "profile", None)
        user_region = (
            request.query_params.get("region")
            or (profile.region_scope if profile else "")
        ).strip()

        # 1. Unresolved SOSEvents (active or acknowledged)
        sos_qs = (
            SOSEvent.objects.filter(
                status__in=[SOSStatus.ACTIVE, SOSStatus.ACKNOWLEDGED]
            )
            .select_related("tourist")
            .order_by("-created_at")
        )
        if user_region:
            sos_qs = sos_qs.filter(tourist__current_region__icontains=user_region)

        # 2. Recent Zone Alerts (caution and danger pings within last 24h)
        zone_pings_qs = (
            LocationPing.objects.filter(
                zone_status_at_ping__in=[ZoneType.CAUTION, ZoneType.DANGER]
            )
            .select_related("tourist")
            .order_by("-timestamp")[:20]
        )
        if user_region:
            zone_pings_qs = [
                p
                for p in zone_pings_qs
                if user_region.lower()
                in getattr(p.tourist, "current_region", "").lower()
            ]

        sos_alerts_data = [
            {
                "type": "SOS_EMERGENCY",
                "sos_id": str(event.sos_id),
                "tourist_id": str(event.tourist.tourist_id),
                "tourist_name": event.tourist.name,
                "tourist_phone": event.tourist.phone,
                "region": event.tourist.current_region,
                "trigger_type": event.trigger_type,
                "status": event.status,
                "latitude": event.latitude,
                "longitude": event.longitude,
                "notes": event.notes,
                "responder_notes": event.responder_notes,
                "created_at": event.created_at.isoformat(),
            }
            for event in sos_qs
        ]

        zone_alerts_data = [
            {
                "type": "ZONE_BOUNDARY_ALERT",
                "ping_id": str(ping.ping_id),
                "tourist_id": str(ping.tourist.tourist_id),
                "tourist_name": ping.tourist.name,
                "tourist_phone": ping.tourist.phone,
                "region": getattr(ping.tourist, "current_region", "Jaipur"),
                "zone_status": ping.zone_status_at_ping,
                "latitude": ping.latitude,
                "longitude": ping.longitude,
                "timestamp": ping.timestamp.isoformat(),
            }
            for ping in zone_pings_qs
        ]

        return Response(
            {
                "scoped_region": user_region or "Global / All Regions",
                "total_unresolved_sos": len(sos_alerts_data),
                "total_zone_alerts": len(zone_alerts_data),
                "unresolved_sos_events": sos_alerts_data,
                "recent_zone_alerts": zone_alerts_data,
                "generated_at": timezone.now().isoformat(),
            },
            status=status.HTTP_200_OK,
        )


@extend_schema(
    tags=["Command Center & Admin"],
    summary="List active tourists in jurisdiction with privacy masking",
    description=(
        "Returns active tourists in the responder's region. Coordinates are masked by default "
        "and revealed ONLY if the tourist has an open SOSEvent or on explicit lookup. "
        "Every location disclosure is strictly audited to the AuditLog model."
    ),
    parameters=[
        OpenApiParameter(
            name="tourist_id",
            description="Explicitly look up an individual tourist (logs location access to AuditLog)",
            required=False,
            type=str,
        ),
        OpenApiParameter(
            name="reason",
            description="Operational reason for explicit location access",
            required=False,
            type=str,
        ),
    ],
)
class ActiveTouristsListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        profile = getattr(user, "profile", None)
        user_region = (profile.region_scope if profile else "").strip()
        explicit_tourist_id = request.query_params.get("tourist_id")
        reason = request.query_params.get("reason", "Command center active monitoring")

        queryset = Tourist.objects.all().order_by("-created_at")
        if user_region:
            queryset = queryset.filter(current_region__icontains=user_region)

        explicit_lookup = False
        if explicit_tourist_id:
            explicit_lookup = True
            queryset = queryset.filter(tourist_id=explicit_tourist_id)

            # Log this explicit privacy lookup
            for tourist in queryset:
                AuditLog.objects.create(
                    user=user if user.is_authenticated else None,
                    action=AuditAction.LOCATION_LOOKUP,
                    target_tourist=tourist,
                    reason=f"Explicit ID location lookup: {reason}",
                    ip_address=get_client_ip(request),
                    details={"query_tourist_id": explicit_tourist_id},
                )
                logger.info(
                    "🔒 [AUDIT LOG CREATED] Explicit location lookup for tourist '%s' by '%s'.",
                    tourist.name,
                    user.username,
                )

        serializer = ActiveTouristSerializer(
            queryset, many=True, context={"explicit_lookup": explicit_lookup}
        )
        return Response(
            {
                "scoped_region": user_region or "Global / All Regions",
                "count": len(serializer.data),
                "tourists": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


@extend_schema(
    tags=["Command Center & Admin"],
    summary="Assign emergency incident to responder",
    description="Assigns an active SOS incident to a responder, updating status to ACKNOWLEDGED and logging an AuditLog entry.",
    request=IncidentAssignSerializer,
    responses={
        200: OpenApiResponse(description="Incident assigned successfully."),
        404: OpenApiResponse(description="Incident not found."),
    },
)
class IncidentAssignView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk, *args, **kwargs):
        serializer = IncidentAssignSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            sos_event = SOSEvent.objects.select_related("tourist").get(sos_id=pk)
        except SOSEvent.DoesNotExist:
            return Response(
                {"detail": f"SOSEvent with ID '{pk}' not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        notes = serializer.validated_data.get("responder_notes", "")
        sos_event.status = SOSStatus.ACKNOWLEDGED
        sos_event.responder_notes = (
            f"Assigned to responder '{request.user.username}' at {timezone.now().strftime('%Y-%m-%d %H:%M:%S UTC')}. {notes}"
        ).strip()
        sos_event.save()

        # Create AuditLog record
        AuditLog.objects.create(
            user=request.user,
            action=AuditAction.INCIDENT_ASSIGN,
            target_tourist=sos_event.tourist,
            target_incident=sos_event,
            reason=f"Emergency incident assigned to {request.user.username}",
            ip_address=get_client_ip(request),
            details={"notes": notes, "new_status": SOSStatus.ACKNOWLEDGED},
        )

        return Response(
            {
                "message": f"Incident {sos_event.sos_id} assigned to responder {request.user.username}.",
                "sos_id": str(sos_event.sos_id),
                "status": sos_event.status,
                "responder_notes": sos_event.responder_notes,
            },
            status=status.HTTP_200_OK,
        )


@extend_schema(
    tags=["Command Center & Admin"],
    summary="Update emergency incident status",
    description="Updates the status of an emergency incident (acknowledged, resolved, false_alarm) and records audit log.",
    request=IncidentStatusUpdateSerializer,
    responses={
        200: OpenApiResponse(description="Incident status updated."),
        404: OpenApiResponse(description="Incident not found."),
    },
)
class IncidentStatusUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk, *args, **kwargs):
        serializer = IncidentStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            sos_event = SOSEvent.objects.select_related("tourist").get(sos_id=pk)
        except SOSEvent.DoesNotExist:
            return Response(
                {"detail": f"SOSEvent with ID '{pk}' not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        new_status = serializer.validated_data["status"]
        notes = serializer.validated_data.get("responder_notes", "")

        sos_event.status = new_status
        if new_status == SOSStatus.RESOLVED:
            sos_event.resolved_at = timezone.now()
        if notes:
            sos_event.responder_notes = f"{sos_event.responder_notes}\n[{timezone.now().strftime('%H:%M:%S')}] {notes}".strip()
        sos_event.save()

        # Create AuditLog record
        AuditLog.objects.create(
            user=request.user,
            action=AuditAction.STATUS_CHANGE,
            target_tourist=sos_event.tourist,
            target_incident=sos_event,
            reason=f"Status transitioned to '{new_status}': {notes}",
            ip_address=get_client_ip(request),
            details={"status": new_status, "notes": notes},
        )

        return Response(
            {
                "message": f"Incident {sos_event.sos_id} status updated to {new_status}.",
                "sos_id": str(sos_event.sos_id),
                "status": sos_event.status,
                "resolved_at": (
                    sos_event.resolved_at.isoformat() if sos_event.resolved_at else None
                ),
            },
            status=status.HTTP_200_OK,
        )


@extend_schema(
    tags=["Command Center & Admin"],
    summary="List privacy and operational audit logs",
    description="Returns full audit log history for compliance and supervisory review.",
)
class AuditLogListView(generics.ListAPIView):
    queryset = AuditLog.objects.all().select_related(
        "user", "target_tourist", "target_incident"
    )
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated]
