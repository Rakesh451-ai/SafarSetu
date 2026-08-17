from django.urls import path

from .views import (
    GuideAdminVerifyView,
    GuideBookingDetailView,
    GuideBookingListCreateView,
    GuideMyProfileView,
    GuideProfileDetailView,
    PublicGuideBrowseView,
    TourPackageDetailView,
    TourPackageListCreateView,
)

app_name = "guide"

urlpatterns = [
    path("guides/", PublicGuideBrowseView.as_view(), name="guide-browse"),
    path("guides/<int:pk>/", GuideProfileDetailView.as_view(), name="guide-detail"),
    path(
        "guides/<int:pk>/verify/", GuideAdminVerifyView.as_view(), name="guide-verify"
    ),
    path("profile/", GuideMyProfileView.as_view(), name="guide-my-profile"),
    path("packages/", TourPackageListCreateView.as_view(), name="package-list-create"),
    path("packages/<int:pk>/", TourPackageDetailView.as_view(), name="package-detail"),
    path("bookings/", GuideBookingListCreateView.as_view(), name="booking-list-create"),
    path("bookings/<int:pk>/", GuideBookingDetailView.as_view(), name="booking-detail"),
]
