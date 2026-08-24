from rest_framework import serializers
from .models import TouristProfile, EmergencyContact


class EmergencyContactSerializer(serializers.ModelSerializer):
    isPrimary = serializers.BooleanField(source='is_primary', default=True)

    class Meta:
        model = EmergencyContact
        fields = ('id', 'name', 'relationship', 'phone', 'email', 'isPrimary')


class TouristProfileSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='digital_id', read_only=True)
    name = serializers.CharField(source='full_name')
    preferredLanguage = serializers.CharField(source='user.preferred_language', read_only=True)
    passportHash = serializers.CharField(source='passport_hash', default='P••••••••3291')
    aadhaarHash = serializers.CharField(source='aadhaar_hash', default='XXXX-XXXX-4819')
    bloodGroup = serializers.CharField(source='blood_group', default='O+ Positive')
    medicalNotes = serializers.CharField(source='medical_notes', default='', allow_blank=True)
    avatarUrl = serializers.CharField(source='avatar_url', default='')
    verificationStatus = serializers.CharField(source='verification_status', read_only=True)
    verifiedBy = serializers.CharField(source='verified_by', read_only=True)
    safetyStatus = serializers.CharField(source='safety_status', read_only=True)
    checkInDueMinutes = serializers.IntegerField(source='check_in_due_minutes', read_only=True)
    lastCheckIn = serializers.CharField(source='last_check_in_location', read_only=True)
    emergencyContacts = EmergencyContactSerializer(source='emergency_contacts', many=True, read_only=True)

    privacySettings = serializers.SerializerMethodField()
    currentTrip = serializers.SerializerMethodField()
    journeyHistory = serializers.SerializerMethodField()

    class Meta:
        model = TouristProfile
        fields = (
            'id', 'name', 'email', 'phone', 'nationality',
            'passportHash', 'aadhaarHash', 'gender', 'dob', 'bloodGroup',
            'medicalNotes', 'avatarUrl', 'preferredLanguage',
            'verificationStatus', 'verifiedBy', 'safetyStatus',
            'checkInDueMinutes', 'lastCheckIn',
            'currentTrip', 'emergencyContacts', 'journeyHistory', 'privacySettings',
            'created_at', 'updated_at'
        )

    def get_privacySettings(self, obj):
        return {
            'shareLiveLocation': obj.share_live_location,
            'autoAlertOnMissedCheckIn': obj.auto_alert_on_missed_check_in,
            'allowEmergencyServiceBeacon': obj.allow_emergency_service_beacon,
            'anonymousSafetyMetrics': obj.anonymous_safety_metrics,
        }

    def get_currentTrip(self, obj):
        active_journey = obj.journeys.filter(status='ACTIVE').first()
        if active_journey:
            return {
                'id': str(active_journey.id),
                'title': active_journey.name,
                'startDate': active_journey.start_date.strftime('%b %d, %Y') if active_journey.start_date else '',
                'endDate': active_journey.end_date.strftime('%b %d, %Y') if active_journey.end_date else '',
                'currentCity': active_journey.current_city,
                'state': active_journey.state,
                'visitedCount': active_journey.visited_count,
                'totalCount': active_journey.total_count,
            }
        return {
            'id': 'trip-golden-triangle',
            'title': 'Golden Triangle & Royal Rajasthan Circuit',
            'startDate': 'Aug 22, 2026',
            'endDate': 'Aug 29, 2026',
            'currentCity': 'Agra',
            'state': 'Uttar Pradesh',
            'visitedCount': 4,
            'totalCount': 9,
        }

    def get_journeyHistory(self, obj):
        history = []
        recent_locations = obj.journey_locations.order_by('-timestamp')[:5] if hasattr(obj, 'journey_locations') else []
        for loc in recent_locations:
            history.append({
                'id': f'jh-{loc.id}',
                'location': loc.location_name,
                'timestamp': loc.timestamp.strftime('%b %d, %I:%M %p') if loc.timestamp else 'Recently',
                'status': loc.status,
                'safetyCheck': loc.safety_check,
            })
        if not history:
            return [
                { 'id': 'jh-1', 'location': 'Qutub Minar, New Delhi', 'timestamp': 'Aug 22, 10:30 AM', 'status': 'completed', 'safetyCheck': 'safe' },
                { 'id': 'jh-2', 'location': 'Taj Mahal East Gate, Agra', 'timestamp': 'Aug 23, 09:15 AM', 'status': 'ongoing', 'safetyCheck': 'safe' }
            ]
        return history


class TouristProfileUpdateSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='full_name', required=False)
    bloodGroup = serializers.CharField(source='blood_group', required=False)
    medicalNotes = serializers.CharField(source='medical_notes', required=False, allow_blank=True)
    avatarUrl = serializers.CharField(source='avatar_url', required=False)
    privacySettings = serializers.DictField(required=False)

    class Meta:
        model = TouristProfile
        fields = (
            'name', 'phone', 'email', 'nationality', 'gender', 'dob',
            'bloodGroup', 'medicalNotes', 'avatarUrl', 'privacySettings'
        )

    def update(self, instance, validated_data):
        privacy_data = validated_data.pop('privacySettings', None)
        if privacy_data:
            if 'shareLiveLocation' in privacy_data:
                instance.share_live_location = privacy_data['shareLiveLocation']
            if 'autoAlertOnMissedCheckIn' in privacy_data:
                instance.auto_alert_on_missed_check_in = privacy_data['autoAlertOnMissedCheckIn']
            if 'allowEmergencyServiceBeacon' in privacy_data:
                instance.allow_emergency_service_beacon = privacy_data['allowEmergencyServiceBeacon']
            if 'anonymousSafetyMetrics' in privacy_data:
                instance.anonymous_safety_metrics = privacy_data['anonymousSafetyMetrics']

        # Update User full name if updated
        if 'full_name' in validated_data and instance.user:
            names = validated_data['full_name'].strip().split(' ', 1)
            instance.user.first_name = names[0]
            instance.user.last_name = names[1] if len(names) > 1 else ''
            instance.user.save(update_fields=['first_name', 'last_name'])

        return super().update(instance, validated_data)


class DigitalTouristIDSerializer(serializers.ModelSerializer):
    tourist_id = serializers.CharField(source='digital_id', read_only=True)
    name = serializers.CharField(source='full_name', read_only=True)
    verification_status = serializers.CharField(read_only=True)
    qr_code = serializers.SerializerMethodField()
    emergency_contact = serializers.SerializerMethodField()

    class Meta:
        model = TouristProfile
        fields = (
            'tourist_id', 'name', 'phone', 'nationality',
            'blood_group', 'verification_status', 'verified_by',
            'qr_code', 'emergency_contact', 'created_at'
        )

    def get_qr_code(self, obj):
        # Return secure verification string / QR data payload
        return f"SAFARSETU-ID-{obj.digital_id}-VERIFIED"

    def get_emergency_contact(self, obj):
        primary = obj.emergency_contacts.filter(is_primary=True).first()
        if primary:
            return EmergencyContactSerializer(primary).data
        first = obj.emergency_contacts.first()
        return EmergencyContactSerializer(first).data if first else None
