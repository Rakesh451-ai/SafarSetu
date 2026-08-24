from rest_framework import serializers
from .models import Destination, AudioGuideTrack, DestinationReview, NearbyAttraction


class AudioGuideTrackSerializer(serializers.ModelSerializer):
    durationSeconds = serializers.IntegerField(source='duration_seconds')
    audioUrl = serializers.CharField(source='audio_url')

    class Meta:
        model = AudioGuideTrack
        fields = ('id', 'language', 'title', 'duration', 'durationSeconds', 'audioUrl', 'transcript')


class DestinationReviewSerializer(serializers.ModelSerializer):
    verifiedStay = serializers.BooleanField(source='verified_stay')

    class Meta:
        model = DestinationReview
        fields = ('id', 'author', 'nationality', 'rating', 'date', 'comment', 'verifiedStay')


class NearbyAttractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NearbyAttraction
        fields = ('name', 'distance', 'image')


class DestinationSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='slug', read_only=True)
    slug = serializers.CharField(read_only=True)
    pk_id = serializers.IntegerField(source='id', read_only=True)
    reviewsCount = serializers.IntegerField(source='reviews_count')
    safetyRating = serializers.FloatField(source='safety_rating')
    openingHours = serializers.CharField(source='opening_hours')
    entryFee = serializers.JSONField(source='entry_fee')
    bestTimeToVisit = serializers.CharField(source='best_time_to_visit')
    safetyGuidelines = serializers.JSONField(source='safety_guidelines')
    dosAndDonts = serializers.JSONField(source='dos_and_donts')
    crowdStatus = serializers.CharField(source='crowd_status')
    crowdPercentage = serializers.IntegerField(source='crowd_percentage')
    qrCode = serializers.CharField(source='qr_code')
    panoramaUrl = serializers.CharField(source='panorama_url', allow_blank=True)
    coordinates = serializers.SerializerMethodField()

    audioGuides = AudioGuideTrackSerializer(source='audio_guides', many=True, read_only=True)
    reviews = DestinationReviewSerializer(many=True, read_only=True)
    nearbyAttractions = NearbyAttractionSerializer(source='nearby_attractions', many=True, read_only=True)

    class Meta:
        model = Destination
        fields = (
            'id', 'slug', 'pk_id', 'name', 'tagline', 'city', 'state', 'category',
            'rating', 'reviewsCount', 'image', 'gallery', 'description', 'history',
            'openingHours', 'entryFee', 'accessibility', 'safetyRating',
            'crowdStatus', 'crowdPercentage', 'weather', 'bestTimeToVisit',
            'facilities', 'audioGuides', 'safetyGuidelines', 'dosAndDonts',
            'coordinates', 'qrCode', 'panoramaUrl', 'nearbyAttractions', 'reviews',
            'verification_status', 'created_at'
        )

    def get_coordinates(self, obj):
        return [obj.latitude, obj.longitude]


class DestinationNearbyResultSerializer(serializers.Serializer):
    destination = DestinationSerializer()
    distance_km = serializers.FloatField()
    safety_status = serializers.CharField()
