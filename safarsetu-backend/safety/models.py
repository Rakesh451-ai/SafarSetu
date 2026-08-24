from django.db import models
from django.conf import settings


class SafetyZone(models.Model):
    ZONE_TYPES = (
        ('safe', 'Safe Zone'),
        ('caution', 'Caution Zone'),
        ('danger', 'Danger Zone'),
    )

    SEVERITY_LEVELS = (
        ('low', 'Low Risk'),
        ('medium', 'Medium Advisory'),
        ('high', 'High Alert'),
        ('critical', 'Critical Hazard'),
    )

    name = models.CharField(max_length=255, db_index=True)
    description = models.TextField()
    zone_type = models.CharField(max_length=20, choices=ZONE_TYPES, default='safe', db_index=True)
    severity = models.CharField(max_length=20, choices=SEVERITY_LEVELS, default='low')

    center_latitude = models.FloatField()
    center_longitude = models.FloatField()

    # Polygon stored as list of [lat, lng] pairs e.g. [[27.1795, 78.0370], [27.1795, 78.0475], ...]
    polygon_coordinates = models.JSONField(
        default=list,
        help_text='List of [latitude, longitude] pairs defining the boundary polygon.'
    )

    active_advisory = models.TextField(blank=True, default='')
    tourist_count = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True, db_index=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_safety_zones'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Safety Zone'
        verbose_name_plural = 'Safety Zones'
        ordering = ['-is_active', 'name']

    def __str__(self):
        return f"{self.name} [{self.get_zone_type_display()}]"


class SafetyAlert(models.Model):
    ALERT_TYPES = (
        ('caution', 'Caution'),
        ('danger', 'Danger / Hazard'),
        ('info', 'Informational Notice'),
    )

    SEVERITY_LEVELS = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPES, default='caution', db_index=True)
    severity = models.CharField(max_length=20, choices=SEVERITY_LEVELS, default='medium', db_index=True)

    location_name = models.CharField(max_length=255)
    latitude = models.FloatField(db_index=True)
    longitude = models.FloatField(db_index=True)

    safety_zone = models.ForeignKey(
        SafetyZone,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='alerts'
    )
    alternative_route = models.TextField(blank=True, default='')
    is_active = models.BooleanField(default=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Safety Alert'
        verbose_name_plural = 'Safety Alerts'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.location_name}) - [{self.severity.upper()}]"


class TouristLocationLog(models.Model):
    tourist = models.ForeignKey(
        'tourists.TouristProfile',
        on_delete=models.CASCADE,
        related_name='location_logs'
    )
    latitude = models.FloatField()
    longitude = models.FloatField()
    safety_status_determined = models.CharField(max_length=20, default='safe')
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        verbose_name = 'Tourist Location Log'
        verbose_name_plural = 'Tourist Location Logs'
        ordering = ['-timestamp']
