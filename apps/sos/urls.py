from django.urls import path

from .views import (
    CheckInActionView,
    CheckInScheduleView,
    SOSEventDetailView,
    SOSEventListView,
    SOSTriggerView,
)

app_name = "sos"

urlpatterns = [
    path("trigger/", SOSTriggerView.as_view(), name="sos-trigger"),
    path("events/", SOSEventListView.as_view(), name="sos-list"),
    path("events/<uuid:pk>/", SOSEventDetailView.as_view(), name="sos-detail"),
    path("checkin/schedule/", CheckInScheduleView.as_view(), name="checkin-schedule"),
    path("checkin/", CheckInActionView.as_view(), name="checkin-action"),
]
