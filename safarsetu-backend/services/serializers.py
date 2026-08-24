from rest_framework import serializers
from .models import VerifiedService


class VerifiedServiceSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='service_id', read_only=True)
    type = serializers.CharField(source='service_type')
    reviewsCount = serializers.IntegerField(source='reviews_count')
    priceUnit = serializers.CharField(source='price_unit')
    licenseNumber = serializers.CharField(source='license_number')
    cancellationPolicy = serializers.CharField(source='cancellation_policy')
    verifiedDate = serializers.CharField(source='verified_date')
    experienceYears = serializers.IntegerField(source='experience_years', allow_null=True)

    class Meta:
        model = VerifiedService
        fields = (
            'id', 'type', 'title', 'provider', 'licenseNumber',
            'location', 'rating', 'reviewsCount', 'price',
            'priceUnit', 'image', 'badge', 'facilities',
            'accessibility', 'cancellationPolicy', 'verifiedDate',
            'languages', 'experienceYears', 'is_verified'
        )
