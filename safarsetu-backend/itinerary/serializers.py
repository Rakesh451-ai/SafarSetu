from rest_framework import serializers
from .models import Itinerary, ItineraryItem


class ItineraryItemSerializer(serializers.ModelSerializer):
    transportMode = serializers.CharField(source='transport_mode')
    travelTimeFromPrev = serializers.CharField(source='travel_time_from_prev', allow_blank=True)
    distanceFromPrev = serializers.CharField(source='distance_from_prev', allow_blank=True)
    safetyStatus = serializers.CharField(source='safety_status')
    recommendedHours = serializers.CharField(source='recommended_hours', allow_blank=True)
    coordinates = serializers.SerializerMethodField()

    class Meta:
        model = ItineraryItem
        fields = (
            'id', 'day', 'order', 'time', 'title', 'location',
            'duration', 'transportMode', 'travelTimeFromPrev',
            'distanceFromPrev', 'cost', 'safetyStatus',
            'recommendedHours', 'coordinates', 'notes'
        )

    def get_coordinates(self, obj):
        return [obj.latitude, obj.longitude]


class ItinerarySerializer(serializers.ModelSerializer):
    items = ItineraryItemSerializer(many=True, read_only=True)

    class Meta:
        model = Itinerary
        fields = (
            'id', 'name', 'description', 'start_date', 'end_date',
            'items', 'created_at', 'updated_at'
        )
