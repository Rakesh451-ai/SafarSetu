from django.urls import path

from . import views

app_name = "web"

urlpatterns = [
    # Onboarding & Core Navigation
    path("", views.onboarding_view, name="onboarding"),
    path("home/", views.home_view, name="home"),
    path("scan/", views.scan_view, name="scan"),
    path("digital-id/", views.scan_view, name="digital-id"),
    path("place/<str:identifier>/", views.place_detail_view, name="place-detail"),
    path("assistant/", views.assistant_view, name="assistant"),
    path("radar/", views.radar_view, name="radar"),
    path("sos/", views.sos_view, name="sos"),
    path("guides/", views.guides_view, name="guides"),
    path("guides/<int:pk>/", views.guide_detail_view, name="guide-detail"),
    path("listings/", views.listings_view, name="listings"),
    path("profile/", views.profile_view, name="profile"),
    # Authentication & Onboarding Routes
    path("login/", views.login_view, name="login"),
    path("register/", views.register_view, name="register"),
    path("logout/", views.logout_view, name="logout"),
    path("auth/google/", views.google_auth_view, name="google-auth"),
    path("auth/google/demo/", views.google_demo_view, name="google-demo"),
    path("demo-login/<str:role>/", views.demo_login_view, name="demo-login"),
    # Direct Action Endpoints
    path("api/simulate-scan/", views.simulate_scan_api, name="simulate-scan"),
    path("api/update-pass/", views.update_pass_api, name="update-pass"),
    path("api/trigger-sos/", views.trigger_sos_api, name="trigger-sos"),
    path("api/assistant-chat/", views.assistant_chat_api, name="assistant-chat"),
    # PWA Endpoints
    path("sw.js", views.service_worker_view, name="service-worker"),
    path("manifest.json", views.manifest_view, name="manifest"),
]
