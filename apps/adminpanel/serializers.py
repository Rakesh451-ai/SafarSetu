from rest_framework import serializers

from apps.identity.models import Tourist
from apps.sos.models import SOSStatus
from apps.tracking.models import LocationPing

from .models import AuditLog


class AuditLogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(
        source="user.username", read_only=True, allow_null=True
    )
    target_tourist_name = serializers.CharField(
        source="target_tourist.name", read_only=True, allow_null=True
    )
    action_display = serializers.CharField(source="get_action_display", read_only=True)

    class Meta:
        model = AuditLog
        fields = [
            "log_id",
            "timestamp",
            "user",
            "user_name",
            "action",
            "action_display",
            "target_tourist",
            "target_tourist_name",
            "target_incident",
            "reason",
            "ip_address",
            "details",
        ]


class ActiveTouristSerializer(serializers.ModelSerializer):
    has_open_sos = serializers.SerializerMethodField()
    open_sos_id = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    privacy_status = serializers.SerializerMethodField()

    class Meta:
        model = Tourist
        fields = [
            "tourist_id",
            "name",
            "nationality",
            "phone",
            "current_region",
            "preferred_language",
            "has_open_sos",
            "open_sos_id",
            "location",
            "privacy_status",
            "created_at",
        ]

    def get_has_open_sos(self, obj) -> bool:
        return obj.sos_events.filter(
            status__in=[SOSStatus.ACTIVE, SOSStatus.ACKNOWLEDGED]
        ).exists()

    def get_open_sos_id(self, obj) -> str:
        active_sos = obj.sos_events.filter(
            status__in=[SOSStatus.ACTIVE, SOSStatus.ACKNOWLEDGED]
        ).first()
        return str(active_sos.sos_id) if active_sos else None

    def get_location(self, obj):
        # Privacy Enforcement: Coordinates are revealed ONLY if the tourist has an open SOS
        # or if an explicit individual lookup was requested (passed via context)
        explicit_lookup = self.context.get("explicit_lookup", False)
        active_sos = obj.sos_events.filter(
            status__in=[SOSStatus.ACTIVE, SOSStatus.ACKNOWLEDGED]
        ).first()

        if active_sos:
            return {
                "latitude": active_sos.latitude,
                "longitude": active_sos.longitude,
                "source": "ACTIVE_SOS_TELEMETRY",
                "timestamp": active_sos.created_at.isoformat(),
            }

        if explicit_lookup:
            latest_ping = (
                LocationPing.objects.filter(tourist=obj).order_by("-timestamp").first()
            )
            if latest_ping:
                return {
                    "latitude": latest_ping.latitude,
                    "longitude": latest_ping.longitude,
                    "source": "EXPLICIT_AUDITED_LOOKUP",
                    "timestamp": latest_ping.timestamp.isoformat(),
                }

        return None

    def get_privacy_status(self, obj) -> str:
        if self.get_has_open_sos(obj):
            return "LOCATION_DISCLOSED_EMERGENCY_OVERRIDE"
        if self.context.get("explicit_lookup", False):
            return "LOCATION_DISCLOSED_AUDITED_LOOKUP"
        return "LOCATION_MASKED_PRIVACY_PROTECTED"


class IncidentAssignSerializer(serializers.Serializer):
    responder_notes = serializers.CharField(
        required=False,
        allow_blank=True,
        default="",
        help_text="Dispatch or acknowledgment notes",
    )


class IncidentStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(
        choices=SOSStatus.choices,
        help_text="Target incident status [active|acknowledged|resolved|false_alarm]",
    )
    responder_notes = serializers.CharField(
        required=False,
        allow_blank=True,
        default="",
        help_text="Resolution or status update notes",
    )
