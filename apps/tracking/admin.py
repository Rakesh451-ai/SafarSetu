from django.contrib import admin
from django.contrib.gis.admin import GISModelAdmin

from .models import LocationPing, Zone


@admin.register(Zone)
class ZoneAdmin(GISModelAdmin):
    list_display = ("name", "type", "region", "created_at")
    list_filter = ("type", "region", "created_at")
    search_fields = ("name", "description", "region")


@admin.register(LocationPing)
class LocationPingAdmin(GISModelAdmin):
    list_display = (
        "ping_id",
        "tourist",
        "zone_status_at_ping",
        "latitude",
        "longitude",
        "timestamp",
    )
    list_filter = ("zone_status_at_ping", "timestamp")
    search_fields = ("tourist__name", "tourist__phone")
