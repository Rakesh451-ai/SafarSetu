from django.urls import path
from .views import QRScanView, QRVerifyTouristView

app_name = 'qr'

urlpatterns = [
    path('scan/', QRScanView.as_view(), name='qr_scan'),
    path('verify/<str:tourist_id>/', QRVerifyTouristView.as_view(), name='qr_verify_tourist'),
]
