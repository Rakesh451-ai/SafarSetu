import json

from rest_framework import serializers

from .models import LocationPing, Zone


class LocationPingInputSerializer(serializers.Serializer):
    tourist_id = serializers.UUIDField(
        required=True,
        help_text="UUID of the tourist transmitting the GPS location ping.",
    )
    latitude = serializers.FloatField(
        required=True,
        min_value=-90.0,
        max_value=90.0,
        help_text="WGS84 Latitude coordinate (-90.0 to 90.0).",
    )
    longitude = serializers.FloatField(
        required=True,
        min_value=-180.0,
        max_value=180.0,
        help_text="WGS84 Longitude coordinate (-180.0 to 180.0).",
    )
    accuracy_meters = serializers.FloatField(
        required=False,
        default=None,
        allow_null=True,
        help_text="GPS receiver horizontal accuracy in meters.",
    )


class LocationPingResponseSerializer(serializers.ModelSerializer):
    tourist_id = serializers.UUIDField(source="tourist.tourist_id", read_only=True)
    tourist_name = serializers.CharField(source="tourist.name", read_only=True)
    latitude = serializers.FloatField(read_only=True)
    longitude = serializers.FloatField(read_only=True)
    zone_status = serializers.CharField(source="zone_status_at_ping", read_only=True)
    matched_zone_name = serializers.CharField(read_only=True, default=None)
    previous_zone_status = serializers.CharField(read_only=True, default=None)
    zone_transitioned = serializers.BooleanField(read_only=True, default=False)

    class Meta:
        model = LocationPing
        fields = [
            "ping_id",
            "tourist_id",
            "tourist_name",
            "latitude",
            "longitude",
            "zone_status",
            "matched_zone_name",
            "previous_zone_status",
            "zone_transitioned",
            "timestamp",
        ]


class ZoneSerializer(serializers.ModelSerializer):
    geojson = serializers.SerializerMethodField()

    class Meta:
        model = Zone
        fields = [
            "zone_id",
            "name",
            "type",
            "region",
            "description",
            "geojson",
            "created_at",
            "updated_at",
        ]

    def get_geojson(self, obj):
        if obj.boundary:
            return json.loads(obj.boundary.geojson)
        return None
