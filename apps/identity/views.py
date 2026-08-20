from django.contrib.auth import logout
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import OpenApiParameter, OpenApiResponse, extend_schema
from rest_framework import generics, permissions, status
from rest_framework.renderers import BaseRenderer, BrowsableAPIRenderer, JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .google_auth import get_or_create_google_user, verify_google_id_token
from .models import DigitalID, EmergencyContact, Tourist, UserProfile, UserRole
from .qr_service import generate_qr_png_bytes, verify_qr_token
from .serializers import (
    ChangePasswordSerializer,
    CustomTokenObtainPairSerializer,
    DigitalIDSerializer,
    EmergencyContactSerializer,
    RegisterSerializer,
    TouristRegistrationSerializer,
    TouristSerializer,
    UnifiedAuthRegisterSerializer,
    UserProfileUpdateSerializer,
    UserSerializer,
)


class PNGImageRenderer(BaseRenderer):
    """
    Renderer for returning raw PNG image binary streams from DRF views.
    """

    media_type = "image/png"
    format = "image"
    charset = None
    render_style = "binary"

    def render(self, data, accepted_media_type=None, renderer_context=None):
        if isinstance(data, bytes):
            return data
        return data


@extend_schema(
    tags=["Identity & Auth"],
    summary="User Login (SimpleJWT & Claims)",
    description=(
        "Authenticates a user via Username OR Email and password. "
        "Returns SimpleJWT access/refresh tokens and user profile details."
    ),
    responses={
        200: OpenApiResponse(
            description="Login successful with tokens and user details."
        ),
        401: OpenApiResponse(description="Invalid credentials."),
    },
)
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@extend_schema(
    tags=["Identity & Auth"],
    summary="Google OAuth2 / One Tap Login",
    description=(
        "Authenticates a user via a Google ID token / credential. "
        "Automatically links or creates the User, issues PyJWT Digital ID, and returns SimpleJWT tokens."
    ),
    responses={
        200: OpenApiResponse(
            description="Google sign-in successful with tokens and user details."
        ),
        400: OpenApiResponse(description="Invalid or expired Google credential."),
    },
)
class GoogleAuthAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = (
            request.data.get("credential")
            or request.data.get("id_token")
            or request.data.get("token")
        )
        role = request.data.get("role", UserRole.TOURIST)

        if not token:
            return Response(
                {"error": "Google credential / id_token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            google_info = verify_google_id_token(token)
            auth_result = get_or_create_google_user(google_info, role=role)
            user = auth_result["user"]
            profile = auth_result["profile"]
            tokens = auth_result["tokens"]
            tourist = auth_result["tourist"]
            digital_id = auth_result["digital_id"]

            resp = {
                "message": (
                    "Signed in with Google successfully."
                    if not auth_result["is_created"]
                    else "Google account registered and digital pass generated."
                ),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "full_name": user.get_full_name() or user.username,
                    "role": profile.role,
                    "is_verified": profile.is_verified,
                },
                "tokens": tokens,
            }
            if tourist:
                resp["tourist"] = TouristSerializer(tourist).data
            if digital_id:
                resp["digital_id"] = DigitalIDSerializer(digital_id).data

            return Response(resp, status=status.HTTP_200_OK)
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=["Identity & Auth"],
    summary="Unified User Registration",
    description=(
        "Registers a new user (Tourist, Guide, Responder, or Admin), automatically "
        "generating profile records, PyJWT Digital ID (for tourists), and JWT credentials."
    ),
    request=UnifiedAuthRegisterSerializer,
    responses={
        201: OpenApiResponse(
            description="Registration successful with user details and tokens."
        ),
        400: OpenApiResponse(description="Validation error."),
    },
)
class UnifiedRegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = UnifiedAuthRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = serializer.save()

        user = result["user"]
        profile = result["profile"]
        tourist = result["tourist"]
        digital_id = result["digital_id"]
        tokens = result["tokens"]

        response_data = {
            "message": "User registered successfully.",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": profile.role,
                "is_verified": profile.is_verified,
                "phone_number": profile.phone_number,
            },
            "tokens": tokens,
        }

        if tourist:
            response_data["tourist"] = TouristSerializer(tourist).data
        if digital_id:
            response_data["digital_id"] = DigitalIDSerializer(digital_id).data

        return Response(response_data, status=status.HTTP_201_CREATED)


@extend_schema(
    tags=["Identity & Auth"],
    summary="Get current user details & digital pass",
    description="Retrieve full details of the currently authenticated user including active passes and role profiles.",
    responses={200: OpenApiResponse(description="Current user profile and pass data.")},
)
class CurrentUserDetailsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = getattr(user, "profile", None)
        role = profile.role if profile else UserRole.TOURIST

        data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": role,
            "is_verified": profile.is_verified if profile else False,
            "phone_number": profile.phone_number if profile else "",
            "region_scope": profile.region_scope if profile else "",
            "emergency_contact_name": profile.emergency_contact_name if profile else "",
            "emergency_contact_phone": (
                profile.emergency_contact_phone if profile else ""
            ),
        }

        # Role specific data
        tourist = getattr(user, "tourist_profile", None)
        if tourist:
            data["tourist"] = TouristSerializer(tourist).data
            active_id = tourist.digital_ids.filter(is_active=True).first()
            if active_id:
                data["digital_id"] = DigitalIDSerializer(active_id).data

        guide = getattr(user, "guide_profile", None)
        if guide:
            data["guide"] = {
                "id": guide.id,
                "verified": guide.verified,
                "languages_spoken": guide.languages_spoken,
                "regions_served": guide.regions_served,
                "rating_avg": str(guide.rating_avg),
                "experience_years": guide.experience_years,
                "hourly_rate": str(guide.hourly_rate),
                "bio": guide.bio,
            }

        return Response(data, status=status.HTTP_200_OK)


@extend_schema(
    tags=["Identity & Auth"],
    summary="Update current user profile",
    description="Updates the profile details of the currently authenticated user.",
    request=UserProfileUpdateSerializer,
    responses={200: OpenApiResponse(description="Profile updated successfully.")},
)
class UserProfileUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        serializer = UserProfileUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        vd = serializer.validated_data

        user = request.user
        if "first_name" in vd:
            user.first_name = vd["first_name"]
        if "last_name" in vd:
            user.last_name = vd["last_name"]
        if "email" in vd and vd["email"]:
            user.email = vd["email"]
        user.save()

        profile, _ = UserProfile.objects.get_or_create(user=user)
        if "phone_number" in vd:
            profile.phone_number = vd["phone_number"]
        if "emergency_contact_name" in vd:
            profile.emergency_contact_name = vd["emergency_contact_name"]
        if "emergency_contact_phone" in vd:
            profile.emergency_contact_phone = vd["emergency_contact_phone"]
        profile.save()

        tourist = getattr(user, "tourist_profile", None)
        if tourist:
            if "nationality" in vd and vd["nationality"]:
                tourist.nationality = vd["nationality"]
            if "preferred_language" in vd and vd["preferred_language"]:
                tourist.preferred_language = vd["preferred_language"]
            if user.get_full_name():
                tourist.name = user.get_full_name()
            if profile.phone_number:
                tourist.phone = profile.phone_number
            tourist.save()

        return Response(
            {"message": "Profile updated successfully.", "username": user.username},
            status=status.HTTP_200_OK,
        )


@extend_schema(
    tags=["Identity & Auth"],
    summary="Change user password",
    description="Updates the authenticated user's password after verifying the old password.",
    request=ChangePasswordSerializer,
    responses={
        200: OpenApiResponse(description="Password changed successfully."),
        400: OpenApiResponse(
            description="Invalid old password or mismatched new passwords."
        ),
    },
)
class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        old_password = serializer.validated_data["old_password"]
        new_password = serializer.validated_data["new_password"]

        if not user.check_password(old_password):
            return Response(
                {"old_password": ["Incorrect old password."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()
        return Response(
            {
                "message": "Password changed successfully. Please login with your new password."
            },
            status=status.HTTP_200_OK,
        )


@extend_schema(
    tags=["Identity & Auth"],
    summary="User Logout / Token Blacklist",
    description="Logs out the current session and blacklists the refresh token if provided.",
    responses={200: OpenApiResponse(description="Logged out successfully.")},
)
class LogoutAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass

        if request.user.is_authenticated:
            logout(request)

        return Response(
            {"message": "Logged out successfully."}, status=status.HTTP_200_OK
        )


@extend_schema(
    tags=["Digital Tourist ID & Registration"],
    summary="Register a new tourist and issue Digital ID",
    description=(
        "Registers a tourist profile, automatically generates a signed PyJWT token with "
        "cryptographic checksum, encodes it into a QR code, and issues SimpleJWT authentication tokens."
    ),
    request=TouristRegistrationSerializer,
    responses={
        201: OpenApiResponse(
            description="Tourist registered successfully with Digital ID and JWT credentials."
        ),
        400: OpenApiResponse(description="Validation error."),
    },
)
class TouristRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = TouristRegistrationSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        result = serializer.save()

        tourist = result["tourist"]
        digital_id = result["digital_id"]
        tokens = result["tokens"]

        response_data = {
            "message": "Tourist registration successful. Digital Tourist ID generated.",
            "tourist": TouristSerializer(tourist).data,
            "digital_id": {
                "id_token": digital_id.id_token,
                "qr_payload_signed": digital_id.qr_payload_signed,
                "qr_image_base64": digital_id.qr_image_base64,
                "issued_at": digital_id.issued_at,
                "expires_at": digital_id.expires_at,
                "is_expired": digital_id.is_expired,
            },
            "tokens": tokens,
        }
        return Response(response_data, status=status.HTTP_201_CREATED)


@extend_schema(
    tags=["Digital Tourist ID & Registration"],
    summary="Get Tourist Digital ID and QR Code",
    description=(
        "Retrieves the active signed Digital ID for the given tourist UUID. "
        "Pass ?format=image to receive the raw PNG image bytes, or omit to receive JSON with base64 PNG."
    ),
    parameters=[
        OpenApiParameter(
            name="format",
            description="Set to 'image' to download/render raw PNG QR image directly.",
            required=False,
            type=str,
            location=OpenApiParameter.QUERY,
        )
    ],
    responses={
        200: OpenApiResponse(
            description="Digital ID JSON data with signed payload and base64 QR image, or raw PNG."
        ),
        404: OpenApiResponse(description="Tourist or active Digital ID not found."),
    },
)
class TouristQRDetailView(APIView):
    permission_classes = [permissions.AllowAny]
    renderer_classes = [JSONRenderer, PNGImageRenderer, BrowsableAPIRenderer]

    def get(self, request, tourist_id, *args, **kwargs):
        tourist = get_object_or_404(Tourist, tourist_id=tourist_id)
        digital_id = DigitalID.objects.filter(tourist=tourist, is_active=True).first()

        if not digital_id:
            return Response(
                {"detail": "No active Digital ID found for this tourist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        format_param = request.query_params.get("format", "").lower()
        accepted_media = getattr(request, "accepted_media_type", "")

        if (
            format_param == "image"
            or "image/png" in accepted_media
            or getattr(request, "accepted_renderer", None) == PNGImageRenderer
        ):
            png_bytes = generate_qr_png_bytes(digital_id.qr_payload_signed)
            return HttpResponse(png_bytes, content_type="image/png")

        is_signature_valid = True
        verification_error = None
        try:
            verify_qr_token(digital_id.qr_payload_signed)
        except Exception as exc:
            is_signature_valid = False
            verification_error = str(exc)

        return Response(
            {
                "tourist_id": tourist.tourist_id,
                "name": tourist.name,
                "nationality": tourist.nationality,
                "id_token": digital_id.id_token,
                "qr_payload_signed": digital_id.qr_payload_signed,
                "qr_image_base64": digital_id.qr_image_base64,
                "issued_at": digital_id.issued_at,
                "expires_at": digital_id.expires_at,
                "is_expired": digital_id.is_expired,
                "is_signature_valid": is_signature_valid,
                "verification_error": verification_error,
            },
            status=status.HTTP_200_OK,
        )


@extend_schema(
    tags=["Digital Tourist ID & Registration"],
    summary="Add an emergency contact",
    description="Creates an emergency contact associated with a tourist.",
    request=EmergencyContactSerializer,
    responses={201: EmergencyContactSerializer},
)
class EmergencyContactCreateView(generics.CreateAPIView):
    queryset = EmergencyContact.objects.all()
    serializer_class = EmergencyContactSerializer
    permission_classes = [permissions.AllowAny]


@extend_schema(
    tags=["Identity & Auth"],
    summary="Register a new system user",
    description="Creates a new standard user (Guide, Responder, Admin, etc.).",
    responses={201: UserSerializer},
)
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


@extend_schema(
    tags=["Identity & Auth"],
    summary="Get current user profile",
    description="Retrieve details of currently authenticated user.",
    responses={200: UserSerializer},
)
class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


@extend_schema(
    tags=["Identity & Auth"],
    summary="Identity status check",
    description="Simple ping endpoint for identity service.",
    responses={200: OpenApiResponse(description="Identity module active")},
)
class IdentityStatusView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({"module": "identity", "status": "active", "version": "1.1.0"})
