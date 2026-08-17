from django.contrib import admin

from .models import CheckInSchedule, SOSEvent


@admin.register(SOSEvent)
class SOSEventAdmin(admin.ModelAdmin):
    list_display = (
        "sos_id",
        "tourist",
        "trigger_type",
        "status",
        "latitude",
        "longitude",
        "created_at",
        "resolved_at",
    )
    list_filter = ("status", "trigger_type", "created_at")
    search_fields = ("tourist__name", "tourist__phone", "notes", "responder_notes")
    readonly_fields = ("sos_id", "created_at")


@admin.register(CheckInSchedule)
class CheckInScheduleAdmin(admin.ModelAdmin):
    list_display = (
        "tourist",
        "expected_interval_minutes",
        "last_checkin_at",
        "is_active",
        "is_overdue",
    )
    list_filter = ("is_active",)
    search_fields = ("tourist__name", "tourist__phone")
