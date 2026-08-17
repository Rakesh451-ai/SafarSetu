import uuid

from django.db import models
from django.utils import timezone

from apps.identity.models import Tourist

from .geo_fields import CompatiblePointField, CompatiblePolygonField


class ZoneType(models.TextChoices):
    SAFE = "safe", "Safe"
    CAUTION = "caution", "Caution"
    DANGER = "danger", "Danger"


class Zone(models.Model):
    zone_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    type = models.CharField(
        max_length=20,
        choices=ZoneType.choices,
        default=ZoneType.SAFE,
        db_index=True,
    )
    boundary = CompatiblePolygonField(
        srid=4326, help_text="Polygon boundary in WGS84 coordinates"
    )
    region = models.CharField(
        max_length=100, db_index=True, help_text="e.g. Jaipur, Delhi, Agra"
    )
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["region", "name"]

    def __str__(self):
        return f"[{self.get_type_display().upper()}] {self.name} ({self.region})"


class LocationPing(models.Model):
    ping_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tourist = models.ForeignKey(
        Tourist, on_delete=models.CASCADE, related_name="location_pings"
    )
    location = CompatiblePointField(
        srid=4326,
        default="POINT(0 0)",
        help_text="GPS Point (Longitude, Latitude) in WGS84",
    )
    timestamp = models.DateTimeField(default=timezone.now, db_index=True)
    zone_status_at_ping = models.CharField(
        max_length=20,
        choices=ZoneType.choices,
        default=ZoneType.SAFE,
        db_index=True,
    )
    accuracy_meters = models.FloatField(null=True, blank=True)

    class Meta:
        ordering = ["-timestamp"]

    @property
    def latitude(self) -> float:
        return self.location.y if self.location else 0.0

    @property
    def longitude(self) -> float:
        return self.location.x if self.location else 0.0

    def __str__(self):
        return (
            f"Ping by {self.tourist.name} @ ({self.latitude:.5f}, {self.longitude:.5f}) "
            f"[{self.zone_status_at_ping}] at {self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}"
        )
