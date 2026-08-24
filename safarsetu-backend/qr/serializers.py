from rest_framework import serializers
from tourists.models import TouristProfile, EmergencyContact


class QRScanRequestSerializer(serializers.Serializer):
    qr_code = serializers.CharField(required=True)
    latitude = serializers.FloatField(required=False, allow_null=True)
    longitude = serializers.FloatField(required=False, allow_null=True)


class PublicEmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = ('name', 'relationship', 'phone')


class PublicDigitalIDVerifySerializer(serializers.ModelSerializer):
    tourist_id = serializers.CharField(source='digital_id', read_only=True)
    name = serializers.CharField(source='full_name', read_only=True)
    verification_status = serializers.CharField(read_only=True)
    verified_by = serializers.CharField(read_only=True)
    blood_group = serializers.CharField(read_only=True)
    emergency_contacts = PublicEmergencyContactSerializer(many=True, read_only=True)
    verified_at = serializers.SerializerMethodField()

    class Meta:
        model = TouristProfile
        fields = (
            'tourist_id', 'name', 'nationality', 'verification_status',
            'verified_by', 'blood_group', 'emergency_contacts', 'verified_at'
        )

    def get_verified_at(self, obj):
        return obj.created_at.strftime('%b %d, %Y') if obj.created_at else 'Verified'
