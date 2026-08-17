import uuid
from datetime import timedelta

from django.db import models
from django.utils import timezone

from apps.identity.models import Tourist
from apps.tracking.geo_fields import CompatiblePointField


class SOSTriggerType(models.TextChoices):
    MANUAL = "manual", "Manual Tourist Trigger"
    MISSED_CHECKIN = "missed_checkin", "Automated Missed Check-in"


class SOSStatus(models.TextChoices):
    ACTIVE = "active", "Active"
    ACKNOWLEDGED = "acknowledged", "Acknowledged"
    RESOLVED = "resolved", "Resolved"
    FALSE_ALARM = "false_alarm", "False Alarm"


class SOSEvent(models.Model):
    sos_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tourist = models.ForeignKey(
        Tourist, on_delete=models.CASCADE, related_name="sos_events"
    )
    trigger_type = models.CharField(
        max_length=20,
        choices=SOSTriggerType.choices,
        default=SOSTriggerType.MANUAL,
        db_index=True,
    )
    location = CompatiblePointField(
        srid=4326,
        default="POINT(0 0)",
        help_text="GPS Coordinates (Longitude, Latitude) when SOS was triggered",
    )
    status = models.CharField(
        max_length=20,
        choices=SOSStatus.choices,
        default=SOSStatus.ACTIVE,
        db_index=True,
    )
    notes = models.TextField(
        blank=True, help_text="Distress notes or automated trigger details"
    )
    responder_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    @property
    def latitude(self) -> float:
        return self.location.y if self.location else 0.0

    @property
    def longitude(self) -> float:
        return self.location.x if self.location else 0.0

    def __str__(self):
        return (
            f"SOS [{self.get_trigger_type_display()}] by {self.tourist.name} "
            f"({self.get_status_display()}) at {self.created_at.strftime('%Y-%m-%d %H:%M:%S')}"
        )


class CheckInSchedule(models.Model):
    schedule_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tourist = models.OneToOneField(
        Tourist, on_delete=models.CASCADE, related_name="checkin_schedule"
    )
    expected_interval_minutes = models.PositiveIntegerField(
        default=60,
        help_text="Required check-in frequency in minutes (e.g., 30, 60, 120)",
    )
    last_checkin_at = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def is_overdue(self) -> bool:
        if not self.is_active:
            return False
        overdue_threshold = self.last_checkin_at + timedelta(
            minutes=self.expected_interval_minutes
        )
        return timezone.now() > overdue_threshold

    def __str__(self):
        status_str = "OVERDUE" if self.is_overdue() else "OK"
        return (
            f"Check-In Schedule for {self.tourist.name} "
            f"(every {self.expected_interval_minutes}m) [{status_str}]"
        )
