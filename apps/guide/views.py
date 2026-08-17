from drf_spectacular.utils import OpenApiParameter, OpenApiResponse, extend_schema
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import GuideBooking, GuideProfile, TourPackage
from .permissions import (
    CanManageBooking,
    IsAdminUserRole,
    IsOwnerGuideOrAdmin,
    is_admin_user,
)
from .serializers import (
    BookingStatusUpdateSerializer,
    GuideBookingSerializer,
    GuideProfileSerializer,
    TourPackageSerializer,
)


@extend_schema(
    tags=["Guide & Tours"],
    summary="Public browse and filter verified guides",
    description="Lists verified local guides. Unverified guides are strictly excluded from this public directory. Supports region and language filtering.",
    parameters=[
        OpenApiParameter(
            name="region",
            description="Filter guides by region/city served (case-insensitive substring).",
            required=False,
            type=str,
            location=OpenApiParameter.QUERY,
        ),
        OpenApiParameter(
            name="language",
            description="Filter guides by language spoken (case-insensitive substring).",
            required=False,
            type=str,
            location=OpenApiParameter.QUERY,
        ),
    ],
    responses={200: GuideProfileSerializer(many=True)},
)
class PublicGuideBrowseView(generics.ListAPIView):
    """
    Public directory of officially verified tourist guides.
    """

    serializer_class = GuideProfileSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        # Only verified guides are returned to the public
        queryset = GuideProfile.objects.filter(verified=True)

        region = self.request.query_params.get("region", "").strip()
        language = self.request.query_params.get("language", "").strip()

        if region:
            queryset = queryset.filter(regions_served__icontains=region)
        if language:
            queryset = queryset.filter(languages_spoken__icontains=language)

        return queryset


@extend_schema(
    tags=["Guide & Tours"],
    summary="Retrieve or update guide profile details",
    description="Retrieve guide profile by ID. Only the guide themselves or an Admin can edit.",
)
class GuideProfileDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = GuideProfile.objects.all()
    serializer_class = GuideProfileSerializer
    permission_classes = [IsOwnerGuideOrAdmin]


@extend_schema(
    tags=["Guide & Tours"],
    summary="Guide profile self-service endpoint",
    description="Retrieve or create/update the authenticated guide's own profile.",
    responses={
        200: GuideProfileSerializer,
        201: GuideProfileSerializer,
        400: OpenApiResponse(description="Guide profile already exists."),
        404: OpenApiResponse(description="Guide profile not found."),
    },
)
class GuideMyProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(responses={200: GuideProfileSerializer})
    def get(self, request):
        guide_profile = GuideProfile.objects.filter(user=request.user).first()
        if not guide_profile:
            return Response(
                {"detail": "No guide profile found for current user."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(GuideProfileSerializer(guide_profile).data)

    @extend_schema(
        request=GuideProfileSerializer, responses={201: GuideProfileSerializer}
    )
    def post(self, request):
        if hasattr(request.user, "guide_profile"):
            return Response(
                {"detail": "Guide profile already exists for current user."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = GuideProfileSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        profile = serializer.save()
        return Response(
            GuideProfileSerializer(profile).data, status=status.HTTP_201_CREATED
        )

    @extend_schema(
        request=GuideProfileSerializer, responses={200: GuideProfileSerializer}
    )
    def patch(self, request):
        guide_profile = GuideProfile.objects.filter(user=request.user).first()
        if not guide_profile:
            return Response(
                {"detail": "No guide profile found for current user."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = GuideProfileSerializer(
            guide_profile, data=request.data, partial=True, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        profile = serializer.save()
        return Response(GuideProfileSerializer(profile).data)


@extend_schema(
    tags=["Guide & Tours"],
    summary="Admin verification of guide profile",
    description="Allows only ADMIN role users to approve and verify a guide profile, making them publicly listed.",
    request=None,
    responses={
        200: GuideProfileSerializer,
        403: OpenApiResponse(
            description="Permission denied. Only admins can verify guides."
        ),
        404: OpenApiResponse(description="Guide profile not found."),
    },
)
class GuideAdminVerifyView(APIView):
    permission_classes = [IsAdminUserRole]

    def post(self, request, pk, *args, **kwargs):
        try:
            guide = GuideProfile.objects.get(pk=pk)
        except GuideProfile.DoesNotExist:
            return Response(
                {"detail": "Guide profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        guide.verified = True
        guide.verified_by = request.user
        guide.save()

        return Response(
            {
                "message": f"Guide {guide.user.get_full_name() or guide.user.username} successfully verified.",
                "guide": GuideProfileSerializer(guide).data,
            },
            status=status.HTTP_200_OK,
        )


@extend_schema(
    tags=["Guide & Tours"],
    summary="List or create tour packages",
    description="List all active tour packages. Guides and Admins can create new packages.",
)
class TourPackageListCreateView(generics.ListCreateAPIView):
    serializer_class = TourPackageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = TourPackage.objects.all()
        guide_id = self.request.query_params.get("guide_id")
        if guide_id:
            queryset = queryset.filter(guide_id=guide_id)
        return queryset


@extend_schema(
    tags=["Guide & Tours"],
    summary="Retrieve, update or delete a tour package",
    description="Retrieve package details. Only owning guide or admin can update or delete.",
)
class TourPackageDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TourPackage.objects.all()
    serializer_class = TourPackageSerializer
    permission_classes = [IsOwnerGuideOrAdmin]


@extend_schema(
    tags=["Guide & Tours"],
    summary="List and create tour bookings",
    description="Tourist creates a booking for a tour package. Tourists see their own bookings, guides see bookings for their packages, admins see all.",
)
class GuideBookingListCreateView(generics.ListCreateAPIView):
    serializer_class = GuideBookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if is_admin_user(user):
            return GuideBooking.objects.all()

        if hasattr(user, "guide_profile"):
            return GuideBooking.objects.filter(tour_package__guide=user.guide_profile)

        if hasattr(user, "tourist_profile"):
            return GuideBooking.objects.filter(tourist=user.tourist_profile)

        return GuideBooking.objects.filter(tourist__user=user)


@extend_schema(
    tags=["Guide & Tours"],
    summary="Retrieve and transition booking status",
    description="Retrieve booking details or transition status ('requested', 'confirmed', 'completed', 'cancelled'). Only assigned guide or admin can confirm/complete. Tourist can cancel.",
)
class GuideBookingDetailView(generics.RetrieveUpdateAPIView):
    queryset = GuideBooking.objects.all()
    permission_classes = [CanManageBooking]

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return BookingStatusUpdateSerializer
        return GuideBookingSerializer
