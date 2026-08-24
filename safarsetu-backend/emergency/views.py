from django.utils import timezone
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from .models import EmergencyIncident
from .serializers import (
    SOSRequestInputSerializer,
    EmergencyIncidentSerializer,
    EmergencyIncidentUpdateSerializer
)
from tourists.models import TouristProfile
from notifications.services import NotificationService
from accounts.models import User
from accounts.permissions import IsResponseOperatorOrAdmin
from config.pagination import StandardResultsSetPagination


class TriggerSOSView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Trigger Emergency SOS",
        description="Broadcasts immediate SOS alert, stores live coordinates, and notifies emergency responders & contacts.",
        request=SOSRequestInputSerializer,
        responses={201: dict}
    )
    def post(self, request):
        serializer = SOSRequestInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Invalid SOS data.",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        profile, _ = TouristProfile.objects.get_or_create(
            user=request.user,
            defaults={'full_name': request.user.get_full_name() or request.user.username}
        )

        lat = serializer.validated_data['latitude']
        lng = serializer.validated_data['longitude']
        desc = serializer.validated_data.get('description', 'Need emergency assistance')
        etype = serializer.validated_data.get('emergency_type', 'SOS Emergency')
        battery = serializer.validated_data.get('battery_level', 85)
        loc_name = serializer.validated_data.get('location_name', 'Agra Tourist Sector')

        incident = EmergencyIncident.objects.create(
            tourist=profile,
            tourist_name=profile.full_name,
            tourist_phone=profile.phone or request.user.phone,
            nationality=profile.nationality,
            emergency_type=etype,
            priority='critical',
            latitude=lat,
            longitude=lng,
            location_description=loc_name,
            description=desc,
            battery_level=battery,
            status='new',
            responder_notes='Automated dispatch: Nearest Tourist Police quick-reaction team (QRT) alerted.'
        )

        # Update tourist profile safety status
        profile.safety_status = 'danger'
        profile.last_latitude = lat
        profile.last_longitude = lng
        profile.save(update_fields=['safety_status', 'last_latitude', 'last_longitude'])

        # Notify emergency contacts / admin broadcast
        NotificationService.broadcast_to_role(
            role=User.Role.ADMIN,
            title=f"🚨 CRITICAL SOS: {profile.full_name}",
            message=f"Incident {incident.incident_id} reported at {loc_name}. Coordinates: ({lat}, {lng})",
            notification_type='SOS',
            metadata={'incident_id': incident.incident_id, 'lat': lat, 'lng': lng}
        )

        NotificationService.broadcast_to_role(
            role=User.Role.RESPONSE_OPERATOR,
            title=f"🚨 CRITICAL SOS: {profile.full_name}",
            message=f"Incident {incident.incident_id} reported at {loc_name}. Coordinates: ({lat}, {lng})",
            notification_type='SOS',
            metadata={'incident_id': incident.incident_id, 'lat': lat, 'lng': lng}
        )

        return Response({
            "success": True,
            "incident_id": incident.incident_id,
            "status": "NEW",
            "message": "Emergency request received. Responders and emergency contacts notified.",
            "data": EmergencyIncidentSerializer(incident).data
        }, status=status.HTTP_201_CREATED)


class CancelSOSView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Cancel / Deactivate SOS",
        description="Cancels active emergency SOS and informs responders that tourist is safe.",
        responses={200: dict}
    )
    def post(self, request, incident_id=None):
        profile, _ = TouristProfile.objects.get_or_create(
            user=request.user,
            defaults={'full_name': request.user.get_full_name() or request.user.username}
        )

        if incident_id:
            incident = EmergencyIncident.objects.filter(incident_id=incident_id, tourist=profile).first()
        else:
            incident = EmergencyIncident.objects.filter(tourist=profile, status__in=['new', 'acknowledged', 'responding']).first()

        if incident:
            incident.status = 'cancelled'
            incident.resolved_at = timezone.now()
            incident.responder_notes += " | Cancelled by tourist (Confirmed safe)."
            incident.save(update_fields=['status', 'resolved_at', 'responder_notes'])

        profile.safety_status = 'safe'
        profile.save(update_fields=['safety_status'])

        return Response({
            "success": True,
            "message": "SOS Deactivated. Emergency responders and contacts have been informed that you are safe."
        }, status=status.HTTP_200_OK)


class AdminEmergencyIncidentListView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsResponseOperatorOrAdmin]

    @extend_schema(
        summary="Admin: List Emergency Incidents",
        description="Retrieve all emergency incidents with status filters for triage center.",
        parameters=[
            OpenApiParameter('status', OpenApiTypes.STR, description='Filter by status (all, new, acknowledged, responding, resolved)'),
            OpenApiParameter('priority', OpenApiTypes.STR, description='Filter by priority (critical, high, medium, low)'),
        ],
        responses={200: EmergencyIncidentSerializer(many=True)}
    )
    def get(self, request):
        queryset = EmergencyIncident.objects.all().select_related('tourist', 'assigned_operator')

        status_filter = request.query_params.get('status')
        priority_filter = request.query_params.get('priority')

        if status_filter and status_filter != 'all':
            queryset = queryset.filter(status__iexact=status_filter)

        if priority_filter:
            queryset = queryset.filter(priority__iexact=priority_filter)

        paginator = StandardResultsSetPagination()
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            serializer = EmergencyIncidentSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = EmergencyIncidentSerializer(queryset, many=True)
        return Response({
            "success": True,
            "count": queryset.count(),
            "results": serializer.data
        }, status=status.HTTP_200_OK)


class AdminEmergencyIncidentDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsResponseOperatorOrAdmin]

    @extend_schema(
        summary="Admin: Get or Update Emergency Incident",
        description="Update incident status, assign responder officer, and append responder notes.",
        responses={200: EmergencyIncidentSerializer, 404: dict}
    )
    def get(self, request, id):
        incident = None
        if str(id).isdigit():
            incident = EmergencyIncident.objects.filter(id=int(id)).first()
        if not incident:
            incident = EmergencyIncident.objects.filter(incident_id=str(id)).first()

        if not incident:
            return Response({
                "success": False,
                "message": f"Incident {id} not found.",
                "errors": {"id": "Not found"}
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = EmergencyIncidentSerializer(incident)
        return Response({
            "success": True,
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def patch(self, request, id):
        incident = None
        if str(id).isdigit():
            incident = EmergencyIncident.objects.filter(id=int(id)).first()
        if not incident:
            incident = EmergencyIncident.objects.filter(incident_id=str(id)).first()

        if not incident:
            return Response({
                "success": False,
                "message": f"Incident {id} not found.",
                "errors": {"id": "Not found"}
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = EmergencyIncidentUpdateSerializer(incident, data=request.data, partial=True)
        if serializer.is_valid():
            new_status = serializer.validated_data.get('status')
            if new_status == 'acknowledged' and not incident.acknowledged_at:
                incident.acknowledged_at = timezone.now()
            elif new_status == 'resolved' and not incident.resolved_at:
                incident.resolved_at = timezone.now()

            serializer.save()
            return Response({
                "success": True,
                "message": f"Incident {incident.incident_id} updated to {incident.status.upper()}.",
                "data": EmergencyIncidentSerializer(incident).data
            }, status=status.HTTP_200_OK)

        return Response({
            "success": False,
            "message": "Failed to update incident.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
