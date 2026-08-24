from django.contrib import admin
from .models import SafetyZone, SafetyAlert, TouristLocationLog


@admin.register(SafetyZone)
class SafetyZoneAdmin(admin.ModelAdmin):
    list_display = ('name', 'zone_type', 'severity', 'center_latitude', 'center_longitude', 'tourist_count', 'is_active', 'updated_at')
    list_filter = ('zone_type', 'severity', 'is_active')
    search_fields = ('name', 'description', 'active_advisory')
    ordering = ('-is_active', 'name')


@admin.register(SafetyAlert)
class SafetyAlertAdmin(admin.ModelAdmin):
    list_display = ('title', 'location_name', 'alert_type', 'severity', 'is_active', 'created_at', 'expires_at')
    list_filter = ('alert_type', 'severity', 'is_active', 'created_at')
    search_fields = ('title', 'description', 'location_name')
    ordering = ('-created_at',)


@admin.register(TouristLocationLog)
class TouristLocationLogAdmin(admin.ModelAdmin):
    list_display = ('tourist', 'latitude', 'longitude', 'safety_status_determined', 'timestamp')
    list_filter = ('safety_status_determined', 'timestamp')
    search_fields = ('tourist__full_name', 'tourist__digital_id')
    ordering = ('-timestamp',)
