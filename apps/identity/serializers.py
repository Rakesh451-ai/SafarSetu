import uuid
from datetime import date, timedelta

from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
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


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Modern SimpleJWT TokenObtainPairSerializer that embeds custom claims
    and returns comprehensive user profile and authentication metadata.
    """

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Custom claims embedded into JWT access/refresh payload
        token["username"] = user.username
        token["email"] = user.email
        token["full_name"] = user.get_full_name() or user.username

        profile = getattr(user, "profile", None)
        if profile:
            token["role"] = profile.role
            token["is_verified"] = profile.is_verified
            token["region_scope"] = profile.region_scope
        else:
            token["role"] = UserRole.TOURIST
            token["is_verified"] = False
            token["region_scope"] = ""

        tourist = getattr(user, "tourist_profile", None)
        if tourist:
            token["tourist_id"] = str(tourist.tourist_id)

        guide = getattr(user, "guide_profile", None)
        if guide:
            token["guide_id"] = guide.id

        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        profile = getattr(user, "profile", None)
        role = profile.role if profile else UserRole.TOURIST
        is_verified = profile.is_verified if profile else False
        region_scope = profile.region_scope if profile else ""

        user_data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": role,
            "is_verified": is_verified,
            "region_scope": region_scope,
            "phone_number": profile.phone_number if profile else "",
        }

        tourist = getattr(user, "tourist_profile", None)
        if tourist:
            user_data["tourist_id"] = str(tourist.tourist_id)
            active_id = tourist.digital_ids.filter(is_active=True).first()
            if active_id:
                user_data["digital_id_token"] = str(active_id.id_token)

        guide = getattr(user, "guide_profile", None)
        if guide:
            user_data["guide_id"] = guide.id
            user_data["guide_verified"] = guide.verified

        data["user"] = user_data
        return data


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            "id",
            "role",
            "phone_number",
            "region_scope",
            "is_verified",
            "emergency_contact_name",
            "emergency_contact_phone",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "is_verified", "created_at", "updated_at"]


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    tourist_id = serializers.SerializerMethodField()
    guide_id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "profile",
            "tourist_id",
            "guide_id",
        ]
        read_only_fields = ["id", "tourist_id", "guide_id"]

    def get_tourist_id(self, obj):
        tourist = getattr(obj, "tourist_profile", None)
        return str(tourist.tourist_id) if tourist else None

    def get_guide_id(self, obj):
        guide = getattr(obj, "guide_profile", None)
        return guide.id if guide else None


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
            "current_region",
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
    current_region = serializers.CharField(
        max_length=100, default="Jaipur", required=False
    )
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
            clean_phone = (
                validated_data["phone"]
                .replace("+", "")
                .replace(" ", "")
                .replace("-", "")
            )
            username = f"tourist_{clean_phone}_{uuid.uuid4().hex[:6]}"

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
    Standard user registration serializer supporting role assignment.
    """

    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(
        choices=UserRole.choices, default=UserRole.TOURIST, write_only=True
    )
    phone_number = serializers.CharField(
        required=False, write_only=True, allow_blank=True
    )
    region_scope = serializers.CharField(
        required=False, write_only=True, allow_blank=True
    )

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
            "region_scope",
        ]

    def create(self, validated_data):
        role = validated_data.pop("role", UserRole.TOURIST)
        phone_number = validated_data.pop("phone_number", "")
        region_scope = validated_data.pop("region_scope", "")
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(
            user=user,
            role=role,
            phone_number=phone_number,
            region_scope=region_scope,
            is_verified=(role == UserRole.ADMIN or role == UserRole.TOURIST),
        )
        return user


class UnifiedAuthRegisterSerializer(serializers.Serializer):
    """
    Modern Unified Registration Serializer for SafarSetu supporting
    Tourist, Local Guide, Responder, and Admin roles.
    """

    role = serializers.ChoiceField(choices=UserRole.choices, default=UserRole.TOURIST)
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    phone_number = serializers.CharField(
        max_length=25, required=False, allow_blank=True
    )

    # Tourist-specific fields
    nationality = serializers.CharField(max_length=100, required=False, default="India")
    id_proof_type = serializers.ChoiceField(
        choices=IDProofType.choices, required=False, default=IDProofType.AADHAAR
    )
    id_proof_number = serializers.CharField(
        max_length=100, required=False, allow_blank=True, default=""
    )
    trip_start = serializers.DateField(required=False, default=date.today)
    trip_end = serializers.DateField(
        required=False, default=lambda: date.today() + timedelta(days=7)
    )

    # Guide-specific fields
    languages_spoken = serializers.CharField(
        max_length=255, required=False, allow_blank=True, default="English, Hindi"
    )
    bio = serializers.CharField(required=False, allow_blank=True, default="")
    regions_served = serializers.CharField(
        max_length=255, required=False, allow_blank=True, default="Jaipur, Rajasthan"
    )
    experience_years = serializers.IntegerField(required=False, default=2)
    hourly_rate = serializers.DecimalField(
        max_digits=10, decimal_places=2, required=False, default=500.00
    )

    # Emergency contact info
    emergency_contact_name = serializers.CharField(
        max_length=150, required=False, allow_blank=True
    )
    emergency_contact_phone = serializers.CharField(
        max_length=25, required=False, allow_blank=True
    )

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError(
                "A user with that username already exists."
            )
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value

    def create(self, validated_data):
        role = validated_data.get("role", UserRole.TOURIST)
        username = validated_data["username"]
        email = validated_data["email"]
        password = validated_data["password"]
        first_name = validated_data.get("first_name", "")
        last_name = validated_data.get("last_name", "")
        phone_number = validated_data.get("phone_number", "")
        emergency_contact_name = validated_data.get("emergency_contact_name", "")
        emergency_contact_phone = validated_data.get("emergency_contact_phone", "")

        # 1. Create Django User
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )

        # 2. Create UserProfile
        profile = UserProfile.objects.create(
            user=user,
            role=role,
            phone_number=phone_number,
            region_scope=(
                validated_data.get("regions_served", "")
                if role == UserRole.RESPONDER
                else ""
            ),
            is_verified=(role == UserRole.TOURIST or role == UserRole.ADMIN),
            emergency_contact_name=emergency_contact_name,
            emergency_contact_phone=emergency_contact_phone,
        )

        tourist = None
        digital_id = None

        # 3. Create Role-Specific Profiles
        if role == UserRole.TOURIST:
            full_name = f"{first_name} {last_name}".strip() or username
            tourist = Tourist.objects.create(
                user=user,
                name=full_name,
                nationality=validated_data.get("nationality", "India"),
                id_proof_type=validated_data.get("id_proof_type", IDProofType.AADHAAR),
                id_proof_number=validated_data.get("id_proof_number", ""),
                phone=phone_number or "+91 98765 43210",
                current_region="Jaipur",
                trip_start=validated_data.get("trip_start", date.today()),
                trip_end=validated_data.get(
                    "trip_end", date.today() + timedelta(days=7)
                ),
            )

            if emergency_contact_name and emergency_contact_phone:
                EmergencyContact.objects.create(
                    tourist=tourist,
                    name=emergency_contact_name,
                    phone=emergency_contact_phone,
                    relation="Emergency Contact",
                )

            digital_id = create_or_rotate_digital_id(tourist)

        elif role == UserRole.GUIDE:
            from apps.guide.models import GuideProfile

            GuideProfile.objects.create(
                user=user,
                bio=validated_data.get(
                    "bio",
                    f"Govt certified local guide for {validated_data.get('regions_served', 'Rajasthan')}.",
                ),
                languages_spoken=validated_data.get(
                    "languages_spoken", "English, Hindi"
                ),
                regions_served=validated_data.get(
                    "regions_served", "Jaipur, Rajasthan"
                ),
                experience_years=validated_data.get("experience_years", 2),
                hourly_rate=validated_data.get("hourly_rate", 500.00),
                verified=False,
            )

        # 4. Generate SimpleJWT tokens
        refresh = RefreshToken.for_user(user)

        return {
            "user": user,
            "profile": profile,
            "tourist": tourist,
            "digital_id": digital_id,
            "tokens": {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "token_type": "Bearer",
            },
        }


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, min_length=8)
    confirm_password = serializers.CharField(
        required=True, write_only=True, min_length=8
    )

    def validate(self, data):
        if data["new_password"] != data["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "New passwords do not match."}
            )
        return data


class UserProfileUpdateSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    emergency_contact_name = serializers.CharField(required=False, allow_blank=True)
    emergency_contact_phone = serializers.CharField(required=False, allow_blank=True)
    nationality = serializers.CharField(required=False, allow_blank=True)
    preferred_language = serializers.CharField(required=False, allow_blank=True)
