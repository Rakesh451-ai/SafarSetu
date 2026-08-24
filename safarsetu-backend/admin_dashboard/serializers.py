from rest_framework import serializers
from tourists.models import TouristProfile
from safety.models import SafetyZone, SafetyAlert
from emergency.models import EmergencyIncident


class AdminStatsSerializer(serializers.Serializer):
    activeTourists = serializers.IntegerField()
    inTransit = serializers.IntegerField()
    activeAlerts = serializers.IntegerField()
    openSOS = serializers.IntegerField()
    missedCheckins = serializers.IntegerField()
    avgResponseTimeMinutes = serializers.FloatField()
    highRiskZonesCount = serializers.IntegerField()
    verifiedDestinations = serializers.IntegerField()
    verifiedServices = serializers.IntegerField()
    touristFlowData = serializers.ListField(child=serializers.DictField())
    categoryIncidents = serializers.ListField(child=serializers.DictField())


class AdminTouristListSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='digital_id')
    name = serializers.CharField(source='full_name')
    safetyStatus = serializers.CharField(source='safety_status')
    verificationStatus = serializers.CharField(source='verification_status')
    registeredDate = serializers.SerializerMethodField()
    activeTripTitle = serializers.SerializerMethodField()

    class Meta:
        model = TouristProfile
        fields = (
            'id', 'name', 'email', 'phone', 'nationality',
            'safetyStatus', 'verificationStatus', 'blood_group',
            'registeredDate', 'activeTripTitle'
        )

    def get_registeredDate(self, obj):
        return obj.created_at.strftime('%b %d, %Y') if obj.created_at else ''

    def get_activeTripTitle(self, obj):
        active = obj.journeys.filter(status='ACTIVE').first()
        return active.name if active else 'Sightseeing Day Tour'
