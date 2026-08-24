from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from tourists.models import TouristProfile, EmergencyContact


class EmergencyContactInputSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255, required=False, allow_blank=True, default='')
    relationship = serializers.CharField(max_length=100, default='Family / Next of Kin', required=False, allow_blank=True)
    phone = serializers.CharField(max_length=25, required=False, allow_blank=True, default='')
    email = serializers.EmailField(required=False, allow_blank=True, default='')
    isPrimary = serializers.BooleanField(required=False, default=True)



class UserRegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=255, write_only=True, required=True)
    password = serializers.CharField(write_only=True, min_length=6, style={'input_type': 'password'})
    emergency_contact = EmergencyContactInputSerializer(required=False, write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'phone', 'password', 'preferred_language', 'emergency_contact')

    def validate_email(self, value):
        normalized = value.lower().strip()
        if User.objects.filter(email__iexact=normalized).exists():
            raise serializers.ValidationError("An account with this email address already exists.")
        return normalized

    def validate_phone(self, value):
        if not value:
            return ''
        return str(value).strip()


    def create(self, validated_data):
        name = validated_data.pop('name')
        password = validated_data.pop('password')
        emergency_contact_data = validated_data.pop('emergency_contact', None)
        email = validated_data['email'].lower().strip()

        names = name.strip().split(' ', 1)
        first_name = names[0]
        last_name = names[1] if len(names) > 1 else ''

        user = User.objects.create_user(
            email=email,
            username=email,
            password=password,
            phone=validated_data.get('phone', ''),
            preferred_language=validated_data.get('preferred_language', User.Language.EN),
            first_name=first_name,
            last_name=last_name,
            role=User.Role.TOURIST,
        )

        # Create or update TouristProfile safely
        tourist_profile, _ = TouristProfile.objects.get_or_create(
            user=user,
            defaults={
                'full_name': name,
                'email': user.email,
                'phone': user.phone or '',
            }
        )

        # Create emergency contact if provided
        if emergency_contact_data:
            contact_name = emergency_contact_data.get('name', '').strip()
            contact_phone = emergency_contact_data.get('phone', '').strip()
            if contact_name and contact_phone:
                EmergencyContact.objects.create(
                    tourist=tourist_profile,
                    name=contact_name,
                    relationship=emergency_contact_data.get('relationship', 'Family / Next of Kin'),
                    phone=contact_phone,
                    email=emergency_contact_data.get('email', ''),
                    is_primary=True,
                )

        return user



class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    def validate(self, attrs):
        email = attrs.get('email', '').lower().strip()
        password = attrs.get('password')

        if not email or not password:
            raise serializers.ValidationError('Both email and password are required.')

        user = User.objects.filter(email__iexact=email).first()
        if not user or not user.check_password(password):
            user = authenticate(username=email, password=password)

        if not user or not user.check_password(password):
            raise serializers.ValidationError('Invalid email or password.')

        if not user.is_active:
            raise serializers.ValidationError('This user account has been disabled.')

        attrs['user'] = user
        return attrs


class UserSummarySerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    digital_id = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'phone', 'role', 'preferred_language', 'digital_id', 'avatar_url', 'is_staff')

    def get_name(self, obj):
        return obj.get_full_name() or obj.username

    def get_digital_id(self, obj):
        if hasattr(obj, 'tourist_profile'):
            return obj.tourist_profile.digital_id
        return None

    def get_avatar_url(self, obj):
        if hasattr(obj, 'tourist_profile'):
            return obj.tourist_profile.avatar_url
        return None


