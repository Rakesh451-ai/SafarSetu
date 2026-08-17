from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import OpenApiParameter, OpenApiResponse, extend_schema
from rest_framework import generics, permissions, status
from rest_framework.renderers import BaseRenderer, BrowsableAPIRenderer, JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import DigitalID, EmergencyContact, Tourist
from .qr_service import generate_qr_png_bytes, verify_qr_token
from .serializers import (
    EmergencyContactSerializer,
    RegisterSerializer,
    TouristRegistrationSerializer,
    TouristSerializer,
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

        # Check if caller requested raw image binary via query param, accept header, or format kwarg
        format_param = request.query_params.get("format", "").lower()
        accepted_media = getattr(request, "accepted_media_type", "")

        if (
            format_param == "image"
            or "image/png" in accepted_media
            or getattr(request, "accepted_renderer", None) == PNGImageRenderer
        ):
            png_bytes = generate_qr_png_bytes(digital_id.qr_payload_signed)
            return HttpResponse(png_bytes, content_type="image/png")

        # Verify payload integrity
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
        return Response({"module": "identity", "status": "active", "version": "1.0.0"})
