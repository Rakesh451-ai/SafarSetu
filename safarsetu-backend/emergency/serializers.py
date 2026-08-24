from rest_framework import serializers
from .models import EmergencyIncident


class SOSRequestInputSerializer(serializers.Serializer):
    latitude = serializers.FloatField(required=True)
    longitude = serializers.FloatField(required=True)
    description = serializers.CharField(required=False, default='Need emergency assistance', allow_blank=True)
    emergency_type = serializers.CharField(required=False, default='SOS Emergency')
    battery_level = serializers.IntegerField(required=False, default=85)
    location_name = serializers.CharField(required=False, default='GPS Coordinates Transmitted', allow_blank=True)


class EmergencyIncidentSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='incident_id', read_only=True)
    touristId = serializers.CharField(source='tourist.digital_id', read_only=True)
    touristName = serializers.CharField(source='tourist_name')
    location = serializers.CharField(source='location_description')
    coordinates = serializers.SerializerMethodField()
    time = serializers.SerializerMethodField()
    type = serializers.CharField(source='emergency_type')
    assignedOfficer = serializers.CharField(source='assigned_officer_name')
    batteryLevel = serializers.IntegerField(source='battery_level')
    responderNotes = serializers.CharField(source='responder_notes', allow_blank=True)

    class Meta:
        model = EmergencyIncident
        fields = (
            'id', 'touristId', 'touristName', 'nationality',
            'location', 'coordinates', 'time', 'type',
            'status', 'priority', 'assignedOfficer',
            'batteryLevel', 'responderNotes',
            'created_at', 'acknowledged_at', 'resolved_at'
        )

    def get_coordinates(self, obj):
        return [obj.latitude, obj.longitude]

    def get_time(self, obj):
        return obj.created_at.strftime('%b %d, %I:%M %p') if obj.created_at else 'Just now'


class EmergencyIncidentUpdateSerializer(serializers.ModelSerializer):
    assignedOfficer = serializers.CharField(source='assigned_officer_name', required=False)
    responderNotes = serializers.CharField(source='responder_notes', required=False, allow_blank=True)

    class Meta:
        model = EmergencyIncident
        fields = ('status', 'priority', 'assignedOfficer', 'responderNotes')
