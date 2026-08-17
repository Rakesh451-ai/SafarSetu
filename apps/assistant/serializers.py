from rest_framework import serializers

from .models import Itinerary


class AssistantQueryInputSerializer(serializers.Serializer):
    tourist_id = serializers.UUIDField(
        required=True, help_text="UUID of the tourist asking the question."
    )
    question = serializers.CharField(
        required=True, min_length=2, help_text="Tourist query or travel question."
    )
    city = serializers.CharField(
        required=False,
        default="Jaipur",
        help_text="Destination city context for RAG retrieval (default: Jaipur).",
    )


class POISummarySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    category = serializers.CharField(required=False)
    city = serializers.CharField()
    rating = serializers.FloatField()
    address = serializers.CharField(required=False)


class AssistantQueryResponseSerializer(serializers.Serializer):
    tourist_id = serializers.UUIDField()
    tourist_name = serializers.CharField()
    language = serializers.CharField()
    question = serializers.CharField()
    answer = serializers.CharField()
    retrieved_pois = POISummarySerializer(many=True)
    timestamp = serializers.DateTimeField()


class ItineraryGenerateInputSerializer(serializers.Serializer):
    tourist_id = serializers.UUIDField(
        required=True, help_text="UUID of the tourist requesting an itinerary."
    )
    destination_city = serializers.CharField(
        required=False,
        default="Jaipur",
        help_text="Destination city (default: Jaipur).",
    )
    duration_days = serializers.IntegerField(
        required=False,
        default=2,
        min_value=1,
        max_value=14,
        help_text="Trip duration in days (1-14).",
    )
    interests = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list,
        help_text="List of tourist interest tags, e.g. ['forts', 'culture', 'shopping'].",
    )
    want_guide = serializers.BooleanField(
        required=False,
        default=True,
        help_text="Whether to attach suggested verified guide tour packages.",
    )


class ItineraryModelSerializer(serializers.ModelSerializer):
    tourist_id = serializers.UUIDField(source="tourist.tourist_id", read_only=True)
    tourist_name = serializers.CharField(source="tourist.name", read_only=True)

    class Meta:
        model = Itinerary
        fields = [
            "itinerary_id",
            "tourist_id",
            "tourist_name",
            "title",
            "destination_city",
            "duration_days",
            "interests",
            "day_by_day_plan",
            "safety_assessment",
            "suggested_packages",
            "created_at",
            "updated_at",
        ]
