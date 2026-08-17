from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import generics

from .models import Listing, ListingCategory
from .permissions import IsAdminOrReadOnly
from .serializers import ListingCategorySerializer, ListingSerializer


@extend_schema(
    tags=["Verified Listings & POIs"],
    summary="List and filter verified listings (or create new for Admin)",
    description=(
        "Public read access with filtering by listing type (hotel, transport, entry_fee, attraction) "
        "and region. Write operations are restricted to ADMIN role and staff."
    ),
    parameters=[
        OpenApiParameter(
            name="type",
            description="Filter by listing type ('hotel', 'transport', 'entry_fee', 'attraction')",
            required=False,
            type=str,
        ),
        OpenApiParameter(
            name="region",
            description="Filter by region (e.g., 'Jaipur', 'Amer')",
            required=False,
            type=str,
        ),
        OpenApiParameter(
            name="verified",
            description="Filter by verification boolean ('true' / 'false')",
            required=False,
            type=bool,
        ),
    ],
)
class ListingListCreateView(generics.ListCreateAPIView):
    serializer_class = ListingSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = Listing.objects.filter(is_active=True).select_related(
            "category", "source_verified_by"
        )
        listing_type = self.request.query_params.get("type")
        region = self.request.query_params.get("region")
        verified = self.request.query_params.get("verified")

        if listing_type:
            queryset = queryset.filter(type__iexact=listing_type)
        if region:
            queryset = queryset.filter(region__icontains=region)
        if verified is not None:
            is_verified = verified.lower() in ("true", "1")
            queryset = queryset.filter(verified=is_verified)

        return queryset


@extend_schema(
    tags=["Verified Listings & POIs"],
    summary="Retrieve, update or delete a listing",
    description="Public read; Admin/Staff only for updates and deletions.",
)
class ListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Listing.objects.all().select_related("category", "source_verified_by")
    serializer_class = ListingSerializer
    permission_classes = [IsAdminOrReadOnly]


@extend_schema(tags=["Verified Listings & POIs"], summary="List categories")
class ListingCategoryListView(generics.ListAPIView):
    queryset = ListingCategory.objects.all()
    serializer_class = ListingCategorySerializer
    permission_classes = [IsAdminOrReadOnly]
