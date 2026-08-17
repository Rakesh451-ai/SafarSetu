import logging

from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.identity.qr_service import validate_qr_signature
from apps.poi.models import POI
from apps.poi.serializers import (
    POIDetailSerializer,
    POIFeaturedSerializer,
    QRScanRequestSerializer,
    TourBriefRequestSerializer,
)
from apps.poi.services import build_tour_brief

logger = logging.getLogger("safarsetu.poi")


class POIFeaturedListView(generics.ListAPIView):
    """
    GET /api/v1/poi/featured
    Returns famous (non-hidden-gem) POIs for the landing page with background video preview URLs.
    """

    permission_classes = [AllowAny]
    serializer_class = POIFeaturedSerializer

    def get_queryset(self):
        return POI.objects.filter(is_hidden_gem=False, is_active=True).order_by(
            "-rating", "name"
        )

    @extend_schema(
        tags=["POI & Tour Preparation"],
        summary="List featured heritage POIs",
        description="Returns famous heritage attractions with short autoplaying video URLs for landing page showcase.",
        responses={200: POIFeaturedSerializer(many=True)},
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class POIDetailView(generics.RetrieveAPIView):
    """
    GET /api/v1/poi/<uuid:pk>/
    Returns full place detail bundle including transport and accommodations.
    """

    permission_classes = [AllowAny]
    queryset = POI.objects.filter(is_active=True)
    serializer_class = POIDetailSerializer
    lookup_field = "pk"

    @extend_schema(
        tags=["POI & Tour Preparation"],
        summary="Get POI detailed profile",
        description="Returns complete place detail with facilities, history, transport, and stays.",
        responses={200: POIDetailSerializer},
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class TourBriefView(APIView):
    """
    POST /api/v1/tour-brief
    Returns a structured tour preparation brief with transport options,
    accommodation price ranges, visit logistics, and nearby hidden gems.
    """

    permission_classes = [AllowAny]

    @extend_schema(
        tags=["POI & Tour Preparation"],
        summary="Generate structured tour brief",
        description="Produces a comprehensive structured tour brief for a POI, whether triggered via physical gate QR scan or landing page click.",
        request=TourBriefRequestSerializer,
        responses={
            200: OpenApiResponse(description="Structured tour brief JSON"),
            404: OpenApiResponse(description="POI not found"),
        },
    )
    def post(self, request, *args, **kwargs):
        serializer = TourBriefRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        poi_id = serializer.validated_data["poi_id"]
        itinerary_id = serializer.validated_data.get("itinerary_id")

        try:
            poi = POI.objects.get(poi_id=poi_id, is_active=True)
        except POI.DoesNotExist:
            return Response(
                {"detail": f"Point of Interest with ID '{poi_id}' not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        brief = build_tour_brief(poi, itinerary_id=itinerary_id)
        return Response(brief, status=status.HTTP_200_OK)


class UnifiedQRScanView(APIView):
    """
    POST /api/v1/scan
    Scans a QR code and returns:
    1. Full POI detail bundle if the QR is an entry_gate_qr_id (placed at physical monuments).
    2. Tourist Digital ID verification if the QR is a personal tourist pass.
    """

    permission_classes = [AllowAny]

    @extend_schema(
        tags=["POI & Tour Preparation"],
        summary="Unified QR Scanner (Gate POI & Tourist ID)",
        description="Distinguishes between Physical Gate QR codes and Tourist Digital ID passes.",
        request=QRScanRequestSerializer,
        responses={
            200: OpenApiResponse(
                description="Resolved QR bundle (Gate POI or Verified Tourist ID)"
            ),
            400: OpenApiResponse(description="Invalid QR payload"),
        },
    )
    def post(self, request, *args, **kwargs):
        serializer = QRScanRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        raw_payload = serializer.validated_data["qr_payload"].strip()

        # 1. Check if raw payload matches any Physical Monument Entry Gate QR ID
        matching_poi = POI.objects.filter(
            entry_gate_qr_id=raw_payload, is_active=True
        ).first()
        if matching_poi:
            brief = build_tour_brief(matching_poi)
            return Response(
                {
                    "scan_type": "ENTRY_GATE_POI",
                    "status": "VALID_GATE_QR",
                    "message": f"Welcome to {matching_poi.name}!",
                    "poi_brief": brief,
                },
                status=status.HTTP_200_OK,
            )

        # 2. Check if it's a Tourist Digital ID (signed JWT token or ID token UUID)
        is_valid, payload_data, error_msg = validate_qr_signature(raw_payload)
        if is_valid:
            return Response(
                {
                    "scan_type": "TOURIST_DIGITAL_ID",
                    "status": "VALID_TOURIST_PASS",
                    "message": "Valid cryptographic Digital Tourist ID pass.",
                    "tourist_data": payload_data,
                },
                status=status.HTTP_200_OK,
            )

        # 3. If neither matches
        return Response(
            {
                "scan_type": "UNKNOWN",
                "status": "INVALID_QR",
                "detail": error_msg or "Unrecognized QR code payload.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
