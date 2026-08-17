from rest_framework import serializers

from apps.poi.models import POI, AccommodationOption, TransportOption


class TransportOptionSerializer(serializers.ModelSerializer):
    mode_display = serializers.CharField(source="get_mode_display", read_only=True)

    class Meta:
        model = TransportOption
        fields = [
            "transport_id",
            "mode",
            "mode_display",
            "from_landmark",
            "estimated_price_range",
            "estimated_duration",
            "verified",
            "source_verified_by",
        ]


class AccommodationOptionSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source="get_type_display", read_only=True)

    class Meta:
        model = AccommodationOption
        fields = [
            "accommodation_id",
            "name",
            "type",
            "type_display",
            "price_range",
            "distance_from_poi",
            "rating",
            "verified",
        ]


class POIFeaturedSerializer(serializers.ModelSerializer):
    class Meta:
        model = POI
        fields = [
            "poi_id",
            "name",
            "category",
            "region",
            "city",
            "description",
            "short_video_url",
            "images",
            "rating",
            "entry_fee_info",
            "best_time_to_visit",
            "avg_visit_duration_minutes",
            "entry_gate_qr_id",
            "is_hidden_gem",
        ]


class POIDetailSerializer(serializers.ModelSerializer):
    transport_options = TransportOptionSerializer(many=True, read_only=True)
    accommodation_options = AccommodationOptionSerializer(many=True, read_only=True)

    class Meta:
        model = POI
        fields = [
            "poi_id",
            "name",
            "category",
            "region",
            "city",
            "description",
            "history",
            "facilities",
            "latitude",
            "longitude",
            "entry_fee_info",
            "best_time_to_visit",
            "avg_visit_duration_minutes",
            "is_hidden_gem",
            "entry_gate_qr_id",
            "short_video_url",
            "three_sixty_media_url",
            "images",
            "rating",
            "transport_options",
            "accommodation_options",
        ]


class TourBriefRequestSerializer(serializers.Serializer):
    poi_id = serializers.UUIDField(required=True, help_text="Target POI UUID")
    itinerary_id = serializers.UUIDField(required=False, allow_null=True, default=None)


class QRScanRequestSerializer(serializers.Serializer):
    qr_payload = serializers.CharField(
        required=True,
        help_text="Raw QR string or token (either an entry_gate_qr_id or a signed tourist ID JWT)",
    )
