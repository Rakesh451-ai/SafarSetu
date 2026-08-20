from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

from .views import (
    ChangePasswordView,
    CurrentUserDetailsView,
    CurrentUserView,
    CustomTokenObtainPairView,
    EmergencyContactCreateView,
    GoogleAuthAPIView,
    IdentityStatusView,
    LogoutAPIView,
    RegisterView,
    TouristQRDetailView,
    TouristRegistrationView,
    UnifiedRegisterView,
    UserProfileUpdateView,
)

app_name = "identity"

urlpatterns = [
    # Status & Ping
    path("status/", IdentityStatusView.as_view(), name="status"),
    # Modern Auth API endpoints
    path("login/", CustomTokenObtainPairView.as_view(), name="login"),
    path("google/", GoogleAuthAPIView.as_view(), name="google-auth"),
    path("register/", UnifiedRegisterView.as_view(), name="auth-register"),
    path("logout/", LogoutAPIView.as_view(), name="logout"),
    path("me/", CurrentUserDetailsView.as_view(), name="me"),
    path("profile/", UserProfileUpdateView.as_view(), name="profile-update"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    # SimpleJWT endpoints
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    # Legacy & Digital Tourist ID endpoints (backward compatible)
    path("user-register/", RegisterView.as_view(), name="user-register"),
    path("user-me/", CurrentUserView.as_view(), name="user-me"),
    path(
        "tourist-register/", TouristRegistrationView.as_view(), name="tourist-register"
    ),
    path("id/<uuid:tourist_id>/qr/", TouristQRDetailView.as_view(), name="tourist-qr"),
    path(
        "emergency-contacts/",
        EmergencyContactCreateView.as_view(),
        name="emergency-contacts",
    ),
]
