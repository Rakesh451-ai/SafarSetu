from rest_framework import serializers
from .models import Journey, JourneyLocation, CheckInSchedule
from destinations.serializers import DestinationSerializer


class JourneyLocationSerializer(serializers.ModelSerializer):
    timestampFormatted = serializers.SerializerMethodField()

    class Meta:
        model = JourneyLocation
        fields = (
            'id', 'location_name', 'latitude', 'longitude',
            'event_type', 'status', 'safety_check', 'notes',
            'timestamp', 'timestampFormatted'
        )

    def get_timestampFormatted(self, obj):
        return obj.timestamp.strftime('%b %d, %I:%M %p') if obj.timestamp else 'Recently'


class JourneySerializer(serializers.ModelSerializer):
    startDate = serializers.DateField(source='start_date', required=False, allow_null=True)
    endDate = serializers.DateField(source='end_date', required=False, allow_null=True)
    currentCity = serializers.CharField(source='current_city', required=False)
    visitedCount = serializers.IntegerField(source='visited_count', required=False)
    totalCount = serializers.IntegerField(source='total_count', required=False)
    currentDestination = DestinationSerializer(source='current_destination', read_only=True)
    locations = JourneyLocationSerializer(many=True, read_only=True)

    class Meta:
        model = Journey
        fields = (
            'id', 'name', 'startDate', 'endDate', 'currentCity', 'state',
            'status', 'visitedCount', 'totalCount', 'currentDestination',
            'locations', 'created_at', 'updated_at'
        )


class CheckInInputSerializer(serializers.Serializer):
    latitude = serializers.FloatField(required=False, default=27.1751)
    longitude = serializers.FloatField(required=False, default=78.0421)
    location_name = serializers.CharField(required=False, allow_blank=True, default='')
    notes = serializers.CharField(required=False, allow_blank=True, default='')
    extend_minutes = serializers.IntegerField(required=False, default=60)
