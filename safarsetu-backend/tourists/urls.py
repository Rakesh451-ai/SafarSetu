from django.urls import path
from .views import TouristProfileView, DigitalTouristIDView

app_name = 'tourists'

urlpatterns = [
    path('profile/', TouristProfileView.as_view(), name='profile'),
    path('digital-id/', DigitalTouristIDView.as_view(), name='digital_id'),
]
