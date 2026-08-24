from django.contrib import admin
from .models import EmergencyIncident


@admin.register(EmergencyIncident)
class EmergencyIncidentAdmin(admin.ModelAdmin):
    list_display = ('incident_id', 'emergency_type', 'tourist_name', 'priority', 'status', 'assigned_officer_name', 'created_at', 'resolved_at')
    list_filter = ('emergency_type', 'status', 'priority', 'created_at')
    search_fields = ('incident_id', 'tourist_name', 'tourist_phone', 'description', 'location_description')
    ordering = ('-created_at',)
