from django.urls import path

from .views import (
    ActiveTouristsListView,
    AdminAlertsView,
    AuditLogListView,
    IncidentAssignView,
    IncidentStatusUpdateView,
)

app_name = "adminpanel"

urlpatterns = [
    path("alerts/", AdminAlertsView.as_view(), name="admin-alerts"),
    path(
        "tourists/active/",
        ActiveTouristsListView.as_view(),
        name="admin-tourists-active",
    ),
    path(
        "incident/<uuid:pk>/assign/",
        IncidentAssignView.as_view(),
        name="incident-assign",
    ),
    path(
        "incident/<uuid:pk>/status/",
        IncidentStatusUpdateView.as_view(),
        name="incident-status",
    ),
    path("audit-logs/", AuditLogListView.as_view(), name="audit-log-list"),
]
