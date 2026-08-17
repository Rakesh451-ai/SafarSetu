import uuid

from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    DigitalID,
    EmergencyContact,
    IDProofType,
    Tourist,
    UserProfile,
    UserRole,
)
from .qr_service import create_or_rotate_digital_id


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            "id",
            "role",
            "phone_number",
            "is_verified",
            "emergency_contact_name",
            "emergency_contact_phone",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "is_verified", "created_at", "updated_at"]


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "profile"]
        read_only_fields = ["id"]


class EmergencyContactSerializer(serializers.ModelSerializer):
    tourist_id = serializers.UUIDField(write_only=True, required=False)

    class Meta:
        model = EmergencyContact
        fields = [
            "contact_id",
            "tourist_id",
            "name",
            "phone",
            "relation",
            "created_at",
        ]
        read_only_fields = ["contact_id", "created_at"]

    def create(self, validated_data):
        tourist_id = validated_data.pop("tourist_id", None)
        request = self.context.get("request")

        if not tourist_id and request and hasattr(request.user, "tourist_profile"):
            tourist = request.user.tourist_profile
        elif tourist_id:
            try:
                tourist = Tourist.objects.get(tourist_id=tourist_id)
            except Tourist.DoesNotExist:
                raise serializers.ValidationError({"tourist_id": "Tourist not found."})
        else:
            raise serializers.ValidationError(
                {"tourist_id": "Tourist ID is required or user must be authenticated."}
            )

        return EmergencyContact.objects.create(tourist=tourist, **validated_data)


class DigitalIDSerializer(serializers.ModelSerializer):
    is_expired = serializers.BooleanField(read_only=True)

    class Meta:
        model = DigitalID
        fields = [
            "id_token",
            "qr_payload_signed",
            "qr_image_base64",
            "issued_at",
            "expires_at",
            "is_active",
            "is_expired",
        ]
        read_only_fields = fields


class TouristSerializer(serializers.ModelSerializer):
    digital_id = serializers.SerializerMethodField()
    emergency_contacts = EmergencyContactSerializer(many=True, read_only=True)

    class Meta:
        model = Tourist
        fields = [
            "tourist_id",
            "name",
            "nationality",
            "id_proof_type",
            "id_proof_number",
            "phone",
            "preferred_language",
            "trip_start",
            "trip_end",
            "digital_id",
            "emergency_contacts",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["tourist_id", "digital_id", "created_at", "updated_at"]

    def get_digital_id(self, obj):
        active_id = obj.digital_ids.filter(is_active=True).first()
        if active_id:
            return DigitalIDSerializer(active_id).data
        return None


class EmergencyContactInputSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150)
    phone = serializers.CharField(max_length=25)
    relation = serializers.CharField(max_length=50)


class TouristRegistrationSerializer(serializers.Serializer):
    # Tourist personal info
    name = serializers.CharField(max_length=200)
    nationality = serializers.CharField(max_length=100)
    id_proof_type = serializers.ChoiceField(
        choices=IDProofType.choices, default=IDProofType.PASSPORT
    )
    id_proof_number = serializers.CharField(
        max_length=100, required=False, allow_blank=True, default=""
    )
    phone = serializers.CharField(max_length=25)
    preferred_language = serializers.CharField(
        max_length=50, default="en", required=False
    )
    trip_start = serializers.DateField()
    trip_end = serializers.DateField()

    # Optional account creation
    username = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(
        required=False, allow_blank=True, write_only=True, min_length=6
    )

    # Optional initial emergency contacts
    emergency_contacts = EmergencyContactInputSerializer(
        many=True, required=False, default=list
    )

    def validate(self, data):
        if data["trip_start"] > data["trip_end"]:
            raise serializers.ValidationError(
                {"trip_end": "trip_end must be on or after trip_start."}
            )
        return data

    def create(self, validated_data):
        contacts_data = validated_data.pop("emergency_contacts", [])
        username = validated_data.pop("username", None)
        email = validated_data.pop("email", "")
        password = validated_data.pop("password", None)

        # Create or link User for SimpleJWT auth
        user = None
        if not username:
            # Generate deterministic unique username from phone and uuid
            username = f"tourist_{validated_data['phone'].replace('+', '').replace(' ', '')}_{uuid.uuid4().hex[:6]}"

        if not User.objects.filter(username=username).exists():
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password or uuid.uuid4().hex,
                first_name=(
                    validated_data["name"].split()[0] if validated_data["name"] else ""
                ),
                last_name=(
                    " ".join(validated_data["name"].split()[1:])
                    if len(validated_data["name"].split()) > 1
                    else ""
                ),
            )
            UserProfile.objects.create(
                user=user,
                role=UserRole.TOURIST,
                phone_number=validated_data["phone"],
                is_verified=True,
            )
        else:
            user = User.objects.get(username=username)

        # Create Tourist
        tourist = Tourist.objects.create(user=user, **validated_data)

        # Create Emergency Contacts
        for contact in contacts_data:
            EmergencyContact.objects.create(tourist=tourist, **contact)

        # Generate signed PyJWT and QR code DigitalID
        digital_id = create_or_rotate_digital_id(tourist)

        # Generate SimpleJWT tokens for client authentication
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        return {
            "tourist": tourist,
            "digital_id": digital_id,
            "tokens": {
                "access": access_token,
                "refresh": refresh_token,
                "token_type": "Bearer",
            },
        }


class RegisterSerializer(serializers.ModelSerializer):
    """
    Standard user registration serializer.
    """

    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(
        choices=UserRole.choices, default=UserRole.TOURIST, write_only=True
    )
    phone_number = serializers.CharField(required=False, write_only=True)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
            "role",
            "phone_number",
        ]

    def create(self, validated_data):
        role = validated_data.pop("role", UserRole.TOURIST)
        phone_number = validated_data.pop("phone_number", "")
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user, role=role, phone_number=phone_number)
        return user
