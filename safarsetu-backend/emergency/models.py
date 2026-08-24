from django.db import models
from django.conf import settings
from tourists.models import TouristProfile
from .utils import generate_incident_id


class EmergencyIncident(models.Model):
    TYPE_CHOICES = (
        ('SOS Emergency', 'SOS Emergency Alert'),
        ('Medical Distress', 'Medical Distress / Health'),
        ('Missed Check-In', 'Missed Check-In Automated Escalation'),
        ('Lost Item / Dispute', 'Lost Item / Local Dispute'),
    )

    STATUS_CHOICES = (
        ('new', 'New / Unacknowledged'),
        ('acknowledged', 'Acknowledged'),
        ('responding', 'Responders Dispatched'),
        ('resolved', 'Resolved'),
        ('cancelled', 'Cancelled by Tourist'),
    )

    PRIORITY_CHOICES = (
        ('critical', 'Critical (Immediate Dispatch)'),
        ('high', 'High Priority'),
        ('medium', 'Medium Priority'),
        ('low', 'Low Priority'),
    )

    incident_id = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        default=generate_incident_id
    )
    tourist = models.ForeignKey(
        TouristProfile,
        on_delete=models.CASCADE,
        related_name='emergency_incidents'
    )
    tourist_name = models.CharField(max_length=255)
    tourist_phone = models.CharField(max_length=25, blank=True)
    nationality = models.CharField(max_length=100, default='Indian')

    emergency_type = models.CharField(
        max_length=50,
        choices=TYPE_CHOICES,
        default='SOS Emergency',
        db_index=True
    )
    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default='critical'
    )

    latitude = models.FloatField()
    longitude = models.FloatField()
    location_description = models.CharField(max_length=255, default='GPS Coordinates Transmitted')

    description = models.TextField(blank=True, default='Need emergency assistance')
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='new',
        db_index=True
    )

    assigned_operator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_incidents'
    )
    assigned_officer_name = models.CharField(
        max_length=255,
        blank=True,
        default='UP Tourist Police Unit 4'
    )
    battery_level = models.IntegerField(default=100)
    responder_notes = models.TextField(
        blank=True,
        default='Emergency signal broadcasted. Nearby rapid response team alerted.'
    )

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    acknowledged_at = models.DateTimeField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Emergency Incident'
        verbose_name_plural = 'Emergency Incidents'
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.incident_id}] {self.emergency_type} - {self.tourist_name} ({self.status.upper()})"

    def save(self, *args, **kwargs):
        if not self.incident_id:
            self.incident_id = generate_incident_id()
        if not self.tourist_name and self.tourist:
            self.tourist_name = self.tourist.full_name
        if not self.tourist_phone and self.tourist:
            self.tourist_phone = self.tourist.phone
        if not self.nationality and self.tourist:
            self.nationality = self.tourist.nationality
        super().save(*args, **kwargs)
