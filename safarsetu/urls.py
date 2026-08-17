"""
URL configuration for SafarSetu project.
Modular monolith routing with OpenAPI documentation via drf-spectacular.
"""

from django.contrib import admin
from django.urls import include, path
from drf_spectacular.utils import OpenApiResponse, extend_schema
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.adminpanel.views import (
    ActiveTouristsListView,
    AdminAlertsView,
    IncidentAssignView,
    IncidentStatusUpdateView,
)
from apps.assistant.views import AssistantQueryView, ItineraryGenerateView
from apps.guide.views import (
    GuideAdminVerifyView,
    GuideBookingDetailView,
    GuideBookingListCreateView,
    GuideProfileDetailView,
    PublicGuideBrowseView,
    TourPackageDetailView,
    TourPackageListCreateView,
)
from apps.identity.views import (
    EmergencyContactCreateView,
    TouristQRDetailView,
    TouristRegistrationView,
)
from apps.listings.views import ListingListCreateView
from apps.poi.views import TourBriefView, UnifiedQRScanView
from apps.sos.views import CheckInActionView, CheckInScheduleView, SOSTriggerView
from apps.tracking.views import LocationPingView, ZoneGeoJSONView


@extend_schema(
    tags=["System & Health"],
    summary="Health check",
    description="Root API health check and module status endpoint.",
    responses={
        200: OpenApiResponse(
            description="System health status and active modules response"
        )
    },
)
@api_view(["GET"])
@permission_classes([AllowAny])
def api_health_check(request):
    """
    Root API health check and module status endpoint.
    """
    return Response(
        {
            "project": "SafarSetu",
            "status": "healthy",
            "version": "1.0.0",
            "modules": [
                "identity",
                "guide",
                "tracking",
                "sos",
                "notifications",
                "listings",
                "adminpanel",
                "assistant",
            ],
            "documentation": {
                "swagger": "/api/docs/",
                "redoc": "/api/redoc/",
                "schema": "/api/schema/",
            },
        }
    )


urlpatterns = [
    # Admin Panel
    path("admin/", admin.site.urls),
    # OpenAPI Schema & Interactive Docs
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
    # Core Health Endpoint
    path("api/health/", api_health_check, name="api-health"),
    # Digital Tourist ID Direct Endpoints
    path("api/v1/register/", TouristRegistrationView.as_view(), name="v1-register"),
    path(
        "api/v1/id/<uuid:tourist_id>/qr/",
        TouristQRDetailView.as_view(),
        name="v1-id-qr",
    ),
    path(
        "api/v1/emergency-contacts/",
        EmergencyContactCreateView.as_view(),
        name="v1-emergency-contacts",
    ),
    # Guide & Tours Direct Endpoints (per spec)
    path("api/v1/guides/", PublicGuideBrowseView.as_view(), name="v1-guide-browse"),
    path(
        "api/v1/guides/<int:pk>/",
        GuideProfileDetailView.as_view(),
        name="v1-guide-detail",
    ),
    path(
        "api/v1/guides/<int:pk>/verify/",
        GuideAdminVerifyView.as_view(),
        name="v1-guide-verify",
    ),
    path(
        "api/v1/packages/",
        TourPackageListCreateView.as_view(),
        name="v1-package-list-create",
    ),
    path(
        "api/v1/packages/<int:pk>/",
        TourPackageDetailView.as_view(),
        name="v1-package-detail",
    ),
    path(
        "api/v1/bookings/",
        GuideBookingListCreateView.as_view(),
        name="v1-booking-list-create",
    ),
    path(
        "api/v1/bookings/<int:pk>/",
        GuideBookingDetailView.as_view(),
        name="v1-booking-detail",
    ),
    # Tracking & Geofencing Direct Endpoints (per spec)
    path(
        "api/v1/location/ping/",
        LocationPingView.as_view(),
        name="v1-location-ping",
    ),
    path("api/v1/zones/", ZoneGeoJSONView.as_view(), name="v1-zones"),
    # SOS Emergency & CheckIn Direct Endpoints (per spec)
    path("api/v1/sos/", SOSTriggerView.as_view(), name="v1-sos-trigger"),
    path(
        "api/v1/checkin/schedule/",
        CheckInScheduleView.as_view(),
        name="v1-checkin-schedule",
    ),
    path("api/v1/checkin/", CheckInActionView.as_view(), name="v1-checkin-action"),
    # AI Assistant & RAG Direct Endpoints (per spec)
    path(
        "api/v1/assistant/query/",
        AssistantQueryView.as_view(),
        name="v1-assistant-query",
    ),
    path(
        "api/v1/itinerary/generate/",
        ItineraryGenerateView.as_view(),
        name="v1-itinerary-generate",
    ),
    # Verified Listings Direct Endpoints (per spec)
    path(
        "api/v1/listings/",
        ListingListCreateView.as_view(),
        name="v1-listings-list-create",
    ),
    # POI & Place-Detail Endpoints (per spec)
    path("api/v1/poi/", include("apps.poi.urls", namespace="poi")),
    path("api/v1/scan/", UnifiedQRScanView.as_view(), name="v1-scan-slash"),
    path("api/v1/scan", UnifiedQRScanView.as_view(), name="v1-scan"),
    path("api/v1/tour-brief/", TourBriefView.as_view(), name="v1-tour-brief-slash"),
    path("api/v1/tour-brief", TourBriefView.as_view(), name="v1-tour-brief"),
    # Admin Panel & Command Center Direct Endpoints (per spec)
    path("api/v1/admin/alerts/", AdminAlertsView.as_view(), name="v1-admin-alerts"),
    path(
        "api/v1/admin/tourists/active/",
        ActiveTouristsListView.as_view(),
        name="v1-admin-tourists-active",
    ),
    path(
        "api/v1/admin/incident/<uuid:pk>/assign/",
        IncidentAssignView.as_view(),
        name="v1-admin-incident-assign",
    ),
    path(
        "api/v1/admin/incident/<uuid:pk>/status/",
        IncidentStatusUpdateView.as_view(),
        name="v1-admin-incident-status",
    ),
    # Modular Monolith App Endpoints (API v1)
    path("api/v1/identity/", include("apps.identity.urls", namespace="identity")),
    path("api/v1/guide/", include("apps.guide.urls", namespace="guide")),
    path("api/v1/tracking/", include("apps.tracking.urls", namespace="tracking")),
    path("api/v1/sos/", include("apps.sos.urls", namespace="sos")),
    path(
        "api/v1/notifications/",
        include("apps.notifications.urls", namespace="notifications"),
    ),
    path("api/v1/listings/", include("apps.listings.urls", namespace="listings")),
    path(
        "api/v1/adminpanel/",
        include("apps.adminpanel.urls", namespace="adminpanel"),
    ),
    path("api/v1/assistant/", include("apps.assistant.urls", namespace="assistant")),
]
