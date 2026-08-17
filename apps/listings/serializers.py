from rest_framework import serializers

from .models import Listing, ListingCategory, Review


class ListingCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingCategory
        fields = ["id", "name", "slug", "icon"]


class ListingSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="title", required=False)
    title = serializers.CharField(required=False)
    category_name = serializers.CharField(
        source="category.name", read_only=True, allow_null=True
    )
    source_verified_by_username = serializers.CharField(
        source="source_verified_by.username", read_only=True, allow_null=True
    )
    type_display = serializers.CharField(source="get_type_display", read_only=True)

    class Meta:
        model = Listing
        fields = [
            "id",
            "type",
            "type_display",
            "name",
            "title",
            "region",
            "city",
            "description",
            "address",
            "latitude",
            "longitude",
            "price_info",
            "price_level",
            "rating",
            "verified",
            "source_verified_by",
            "source_verified_by_username",
            "category",
            "category_name",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]

    def validate(self, attrs):
        if (
            not attrs.get("title")
            and not self.initial_data.get("name")
            and not self.initial_data.get("title")
        ):
            raise serializers.ValidationError({"name": "This field is required."})
        if not attrs.get("title") and self.initial_data.get("name"):
            attrs["title"] = self.initial_data.get("name")
        return attrs

    def create(self, validated_data):
        # Auto-attach source_verified_by if request user is staff/admin and verified is True
        request = self.context.get("request")
        if request and request.user.is_authenticated and validated_data.get("verified"):
            validated_data.setdefault("source_verified_by", request.user)
        return super().create(validated_data)


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.get_full_name", read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "listing",
            "user",
            "user_name",
            "rating",
            "comment",
            "created_at",
        ]
        read_only_fields = ["created_at"]
