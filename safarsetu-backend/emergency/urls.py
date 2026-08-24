from django.urls import path
from .views import (
    TriggerSOSView,
    CancelSOSView,
    AdminEmergencyIncidentListView,
    AdminEmergencyIncidentDetailView
)

app_name = 'emergency'

urlpatterns = [
    path('sos/', TriggerSOSView.as_view(), name='trigger_sos'),
    path('sos/cancel/', CancelSOSView.as_view(), name='cancel_sos'),
    path('sos/<str:incident_id>/cancel/', CancelSOSView.as_view(), name='cancel_sos_with_id'),
    path('incidents/', AdminEmergencyIncidentListView.as_view(), name='emergency_incidents_list'),
    path('incidents/<str:id>/', AdminEmergencyIncidentDetailView.as_view(), name='emergency_incident_detail'),
]
