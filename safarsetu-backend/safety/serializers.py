from rest_framework import serializers
from .models import SafetyZone, SafetyAlert, TouristLocationLog


class SafetyZoneSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source='zone_type')
    center = serializers.SerializerMethodField()
    polygon = serializers.JSONField(source='polygon_coordinates')
    activeAdvisory = serializers.CharField(source='active_advisory', allow_blank=True)
    touristCount = serializers.IntegerField(source='tourist_count')
    lastUpdated = serializers.SerializerMethodField()

    class Meta:
        model = SafetyZone
        fields = (
            'id', 'name', 'type', 'center', 'polygon',
            'description', 'activeAdvisory', 'touristCount',
            'severity', 'is_active', 'lastUpdated'
        )

    def get_center(self, obj):
        return [obj.center_latitude, obj.center_longitude]

    def get_lastUpdated(self, obj):
        return obj.updated_at.strftime('%b %d, %I:%M %p') if obj.updated_at else 'Recently'


class SafetyAlertSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source='alert_type')
    location = serializers.CharField(source='location_name')
    alternativeRoute = serializers.CharField(source='alternative_route', allow_blank=True)
    isActive = serializers.BooleanField(source='is_active')
    timestamp = serializers.SerializerMethodField()
    coordinates = serializers.SerializerMethodField()

    class Meta:
        model = SafetyAlert
        fields = (
            'id', 'type', 'title', 'description', 'location',
            'coordinates', 'alternativeRoute', 'severity', 'isActive',
            'timestamp', 'created_at'
        )

    def get_timestamp(self, obj):
        return obj.created_at.strftime('%b %d, %I:%M %p') if obj.created_at else 'Just now'

    def get_coordinates(self, obj):
        return [obj.latitude, obj.longitude]


class LocationSafetyCheckResponseSerializer(serializers.Serializer):
    status = serializers.CharField()
    zone = serializers.CharField(allow_null=True)
    message = serializers.CharField()
    severity = serializers.CharField(required=False)
    zone_id = serializers.IntegerField(allow_null=True, required=False)


class LocationUpdateInputSerializer(serializers.Serializer):
    latitude = serializers.FloatField(required=True)
    longitude = serializers.FloatField(required=True)
