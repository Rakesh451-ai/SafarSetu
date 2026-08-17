from rest_framework import serializers

from apps.identity.models import Tourist
from apps.listings.serializers import ListingSerializer

from .models import BookingStatus, GuideBooking, GuideProfile, TourPackage
from .permissions import is_admin_user


class GuideProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    full_name = serializers.CharField(source="user.get_full_name", read_only=True)
    verified_by_username = serializers.CharField(
        source="verified_by.username", read_only=True, default=None
    )

    class Meta:
        model = GuideProfile
        fields = [
            "id",
            "username",
            "full_name",
            "bio",
            "languages_spoken",
            "regions_served",
            "verified",
            "verified_by_username",
            "rating_avg",
            "experience_years",
            "hourly_rate",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "rating_avg",
            "verified_by_username",
            "created_at",
            "updated_at",
        ]

    def create(self, validated_data):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError(
                "Authentication required to create a guide profile."
            )

        # Non-admin users cannot self-verify
        if not is_admin_user(request.user):
            validated_data["verified"] = False
            validated_data.pop("verified_by", None)
        else:
            if validated_data.get("verified"):
                validated_data["verified_by"] = request.user

        validated_data["user"] = request.user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get("request")
        # Ensure only admin can flip verified field
        if "verified" in validated_data and not is_admin_user(request.user):
            validated_data.pop("verified")

        if is_admin_user(request.user) and validated_data.get("verified") is True:
            validated_data["verified_by"] = request.user

        return super().update(instance, validated_data)


class TourPackageSerializer(serializers.ModelSerializer):
    guide_id = serializers.PrimaryKeyRelatedField(source="guide", read_only=True)
    guide_name = serializers.CharField(
        source="guide.user.get_full_name", read_only=True
    )
    guide_verified = serializers.BooleanField(source="guide.verified", read_only=True)
    poi_details = ListingSerializer(source="poi_refs", many=True, read_only=True)

    class Meta:
        model = TourPackage
        fields = [
            "id",
            "guide_id",
            "guide_name",
            "guide_verified",
            "title",
            "description",
            "poi_refs",
            "poi_details",
            "duration",
            "price",
            "max_group_size",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "guide_id",
            "guide_name",
            "guide_verified",
            "created_at",
            "updated_at",
        ]

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user

        if is_admin_user(user):
            # Admin can specify guide or fallback to user's guide_profile
            if "guide" not in validated_data:
                if hasattr(user, "guide_profile"):
                    validated_data["guide"] = user.guide_profile
                else:
                    raise serializers.ValidationError(
                        {"guide": "Guide profile must be associated."}
                    )
        else:
            if not hasattr(user, "guide_profile"):
                raise serializers.ValidationError(
                    "Only users with a Guide Profile can create tour packages."
                )
            validated_data["guide"] = user.guide_profile

        poi_refs = validated_data.pop("poi_refs", [])
        tour_package = TourPackage.objects.create(**validated_data)
        if poi_refs:
            tour_package.poi_refs.set(poi_refs)
        return tour_package


class GuideBookingSerializer(serializers.ModelSerializer):
    tourist_id = serializers.UUIDField(required=False, write_only=True)
    tourist_name = serializers.CharField(source="tourist.name", read_only=True)
    tour_package_title = serializers.CharField(
        source="tour_package.title", read_only=True
    )
    guide_name = serializers.CharField(
        source="tour_package.guide.user.get_full_name", read_only=True
    )
    guide_user_id = serializers.IntegerField(
        source="tour_package.guide.user.id", read_only=True
    )

    class Meta:
        model = GuideBooking
        fields = [
            "id",
            "tourist_id",
            "tourist_name",
            "tour_package",
            "tour_package_title",
            "guide_name",
            "guide_user_id",
            "status",
            "scheduled_date",
            "number_of_people",
            "special_requests",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "status",
            "tourist_name",
            "tour_package_title",
            "guide_name",
            "guide_user_id",
            "created_at",
            "updated_at",
        ]

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user
        tourist_id = validated_data.pop("tourist_id", None)

        if tourist_id:
            try:
                tourist = Tourist.objects.get(tourist_id=tourist_id)
            except Tourist.DoesNotExist:
                raise serializers.ValidationError(
                    {"tourist_id": "Specified tourist not found."}
                )
        elif hasattr(user, "tourist_profile"):
            tourist = user.tourist_profile
        else:
            # Check if tourist exists with matching user
            tourist = Tourist.objects.filter(user=user).first()
            if not tourist:
                raise serializers.ValidationError(
                    "You must have a Tourist profile or supply a valid tourist_id to make a booking."
                )

        validated_data["tourist"] = tourist
        validated_data["status"] = BookingStatus.REQUESTED
        return super().create(validated_data)


class BookingStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = GuideBooking
        fields = ["status"]

    def validate_status(self, value):
        request = self.context.get("request")
        booking = self.instance
        user = request.user

        if is_admin_user(user):
            return value

        is_assigned_guide = booking.tour_package.guide.user == user
        is_booking_tourist = (
            booking.tourist.user == user if booking.tourist.user else False
        )

        if value in [BookingStatus.CONFIRMED, BookingStatus.COMPLETED]:
            if not is_assigned_guide:
                raise serializers.ValidationError(
                    f"Only the assigned guide or an admin can transition booking status to '{value}'."
                )

        if value == BookingStatus.CANCELLED:
            if not (is_assigned_guide or is_booking_tourist):
                raise serializers.ValidationError(
                    "Only the assigned guide, booking tourist, or admin can cancel this booking."
                )

        return value
