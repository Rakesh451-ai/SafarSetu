from django.urls import path

from apps.poi.views import (
    POIDetailView,
    POIFeaturedListView,
    TourBriefView,
    UnifiedQRScanView,
)

app_name = "poi"

urlpatterns = [
    path("featured", POIFeaturedListView.as_view(), name="poi_featured"),
    path("featured/", POIFeaturedListView.as_view(), name="poi_featured_slash"),
    path("scan", UnifiedQRScanView.as_view(), name="unified_scan"),
    path("scan/", UnifiedQRScanView.as_view(), name="unified_scan_slash"),
    path("tour-brief", TourBriefView.as_view(), name="tour_brief"),
    path("tour-brief/", TourBriefView.as_view(), name="tour_brief_slash"),
    path("<uuid:pk>", POIDetailView.as_view(), name="poi_detail"),
    path("<uuid:pk>/", POIDetailView.as_view(), name="poi_detail_slash"),
]
