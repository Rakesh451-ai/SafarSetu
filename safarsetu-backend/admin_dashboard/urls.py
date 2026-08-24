from django.urls import path
from .views import (
    AdminDashboardStatsView,
    AdminTouristListView,
    AdminSafetyZoneListView,
    AdminSafetyAlertListView
)
from emergency.views import AdminEmergencyIncidentListView, AdminEmergencyIncidentDetailView

app_name = 'admin_dashboard'

urlpatterns = [
    path('dashboard/', AdminDashboardStatsView.as_view(), name='admin_dashboard_stats'),
    path('tourists/', AdminTouristListView.as_view(), name='admin_tourists'),
    path('safety-zones/', AdminSafetyZoneListView.as_view(), name='admin_safety_zones'),
    path('alerts/', AdminSafetyAlertListView.as_view(), name='admin_alerts'),
    path('emergencies/', AdminEmergencyIncidentListView.as_view(), name='admin_emergencies'),
    path('emergencies/<str:id>/', AdminEmergencyIncidentDetailView.as_view(), name='admin_emergency_detail'),
]
