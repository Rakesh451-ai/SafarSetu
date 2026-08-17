from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from .views import (
    CurrentUserView,
    EmergencyContactCreateView,
    IdentityStatusView,
    RegisterView,
    TouristQRDetailView,
    TouristRegistrationView,
)

app_name = "identity"

urlpatterns = [
    # Status & User Auth
    path("status/", IdentityStatusView.as_view(), name="status"),
    path("user-register/", RegisterView.as_view(), name="user-register"),
    path("me/", CurrentUserView.as_view(), name="me"),
    # SimpleJWT Auth endpoints
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    # Digital Tourist ID Endpoints
    path("register/", TouristRegistrationView.as_view(), name="register"),
    path("id/<uuid:tourist_id>/qr/", TouristQRDetailView.as_view(), name="tourist-qr"),
    path(
        "emergency-contacts/",
        EmergencyContactCreateView.as_view(),
        name="emergency-contacts",
    ),
]
