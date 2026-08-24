from django.urls import path
from .views import (
    SafetyCheckView,
    SafetyAlertListView,
    NearbySafetyAlertsView,
    LocationUpdateView
)

app_name = 'safety'

urlpatterns = [
    path('check/', SafetyCheckView.as_view(), name='safety_check'),
    path('alerts/', SafetyAlertListView.as_view(), name='safety_alerts'),
    path('alerts/nearby/', NearbySafetyAlertsView.as_view(), name='safety_alerts_nearby'),
    path('location/', LocationUpdateView.as_view(), name='location_update'),
]
