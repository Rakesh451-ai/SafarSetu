import uuid

from django.contrib.auth.models import User
from django.db import models


class AuditAction(models.TextChoices):
    LOCATION_LOOKUP = "LOCATION_LOOKUP", "Tourist Location Access"
    TOURIST_DETAIL_ACCESS = "TOURIST_DETAIL_ACCESS", "Tourist Record View"
    INCIDENT_ASSIGN = "INCIDENT_ASSIGN", "Emergency Incident Assignment"
    STATUS_CHANGE = "STATUS_CHANGE", "Emergency Incident Status Update"
    GEOFENCE_OVERRIDE = "GEOFENCE_OVERRIDE", "Safety Geofence Override"


class AuditLog(models.Model):
    log_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_logs",
        help_text="Responder or Admin who performed the action",
    )
    action = models.CharField(
        max_length=50,
        choices=AuditAction.choices,
        default=AuditAction.LOCATION_LOOKUP,
        db_index=True,
    )
    target_tourist = models.ForeignKey(
        "identity.Tourist",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_logs",
    )
    target_incident = models.ForeignKey(
        "sos.SOSEvent",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_logs",
    )
    reason = models.TextField(
        blank=True,
        help_text="Operational justification (mandatory for privacy location access)",
    )
    ip_address = models.CharField(max_length=45, blank=True, default="")
    details = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self):
        user_name = self.user.username if self.user else "System"
        tourist_str = f" for {self.target_tourist.name}" if self.target_tourist else ""
        return f"[{self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}] {user_name} -> {self.get_action_display()}{tourist_str}"


class SystemMetric(models.Model):
    metric_name = models.CharField(max_length=100, db_index=True)
    metric_value = models.FloatField()
    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.metric_name}: {self.metric_value}"
