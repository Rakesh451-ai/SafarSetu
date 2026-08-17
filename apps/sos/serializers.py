from rest_framework import serializers

from apps.identity.models import Tourist

from .models import CheckInSchedule, SOSEvent, SOSTriggerType


class SOSTriggerInputSerializer(serializers.Serializer):
    tourist_id = serializers.UUIDField(
        required=True,
        help_text="UUID of the distressed tourist triggering the SOS alert.",
    )
    latitude = serializers.FloatField(
        required=True,
        min_value=-90.0,
        max_value=90.0,
        help_text="Current WGS84 Latitude (-90.0 to 90.0).",
    )
    longitude = serializers.FloatField(
        required=True,
        min_value=-180.0,
        max_value=180.0,
        help_text="Current WGS84 Longitude (-180.0 to 180.0).",
    )
    trigger_type = serializers.ChoiceField(
        choices=SOSTriggerType.choices,
        default=SOSTriggerType.MANUAL,
        help_text="Trigger source ('manual' or 'missed_checkin').",
    )
    notes = serializers.CharField(
        required=False,
        allow_blank=True,
        default="",
        help_text="Optional emergency message or notes.",
    )


class SOSEventResponseSerializer(serializers.ModelSerializer):
    tourist_id = serializers.UUIDField(source="tourist.tourist_id", read_only=True)
    tourist_name = serializers.CharField(source="tourist.name", read_only=True)
    tourist_phone = serializers.CharField(source="tourist.phone", read_only=True)
    latitude = serializers.FloatField(read_only=True)
    longitude = serializers.FloatField(read_only=True)
    trigger_display = serializers.CharField(
        source="get_trigger_type_display", read_only=True
    )
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = SOSEvent
        fields = [
            "sos_id",
            "tourist_id",
            "tourist_name",
            "tourist_phone",
            "trigger_type",
            "trigger_display",
            "status",
            "status_display",
            "latitude",
            "longitude",
            "notes",
            "responder_notes",
            "created_at",
            "resolved_at",
        ]


class CheckInScheduleSerializer(serializers.ModelSerializer):
    tourist_id = serializers.UUIDField(source="tourist.tourist_id")
    tourist_name = serializers.CharField(source="tourist.name", read_only=True)
    is_overdue = serializers.SerializerMethodField()

    class Meta:
        model = CheckInSchedule
        fields = [
            "schedule_id",
            "tourist_id",
            "tourist_name",
            "expected_interval_minutes",
            "last_checkin_at",
            "is_active",
            "is_overdue",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "schedule_id",
            "tourist_name",
            "last_checkin_at",
            "is_overdue",
            "created_at",
            "updated_at",
        ]

    def get_is_overdue(self, obj) -> bool:
        return obj.is_overdue()

    def create(self, validated_data):
        tourist_data = validated_data.pop("tourist")
        tourist_id = tourist_data["tourist_id"]
        try:
            tourist = Tourist.objects.get(tourist_id=tourist_id)
        except Tourist.DoesNotExist:
            raise serializers.ValidationError(
                {"tourist_id": f"Tourist '{tourist_id}' not found."}
            )

        schedule, _ = CheckInSchedule.objects.update_or_create(
            tourist=tourist,
            defaults=validated_data,
        )
        return schedule


class CheckInActionSerializer(serializers.Serializer):
    tourist_id = serializers.UUIDField(
        required=True, help_text="UUID of the tourist checking in."
    )
    latitude = serializers.FloatField(
        required=False,
        default=None,
        allow_null=True,
        min_value=-90.0,
        max_value=90.0,
    )
    longitude = serializers.FloatField(
        required=False,
        default=None,
        allow_null=True,
        min_value=-180.0,
        max_value=180.0,
    )
