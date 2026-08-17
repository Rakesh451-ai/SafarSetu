from django.contrib import admin

from .models import AuditLog, SystemMetric


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = (
        "log_id",
        "timestamp",
        "user",
        "action",
        "target_tourist",
        "target_incident",
        "ip_address",
    )
    list_filter = ("action", "timestamp")
    search_fields = (
        "user__username",
        "target_tourist__name",
        "target_tourist__phone",
        "reason",
        "ip_address",
    )
    readonly_fields = (
        "log_id",
        "timestamp",
        "user",
        "action",
        "target_tourist",
        "target_incident",
        "reason",
        "ip_address",
        "details",
    )


@admin.register(SystemMetric)
class SystemMetricAdmin(admin.ModelAdmin):
    list_display = ("metric_name", "metric_value", "recorded_at")
    list_filter = ("metric_name", "recorded_at")
