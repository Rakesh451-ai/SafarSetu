from django.urls import path

from .views import LocationPingView, ZoneGeoJSONView

app_name = "tracking"

urlpatterns = [
    path("ping/", LocationPingView.as_view(), name="location-ping"),
    path("zones/", ZoneGeoJSONView.as_view(), name="zones-geojson"),
]
