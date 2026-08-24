from django.db import models
from django.utils import timezone
from tourists.models import TouristProfile
from destinations.models import Destination


class Journey(models.Model):
    STATUS_CHOICES = (
        ('PLANNED', 'Planned'),
        ('ACTIVE', 'Active / In Progress'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    )

    tourist = models.ForeignKey(
        TouristProfile,
        on_delete=models.CASCADE,
        related_name='journeys'
    )
    name = models.CharField(max_length=255)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    current_destination = models.ForeignKey(
        Destination,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='active_journeys'
    )
    current_city = models.CharField(max_length=100, default='Agra')
    state = models.CharField(max_length=100, default='Uttar Pradesh')

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='ACTIVE',
        db_index=True
    )
    visited_count = models.IntegerField(default=0)
    total_count = models.IntegerField(default=1)

    expected_check_in_time = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Journey'
        verbose_name_plural = 'Journeys'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.tourist.full_name} [{self.status}]"


class JourneyLocation(models.Model):
    EVENT_TYPES = (
        ('CHECK_IN', 'Tourist Safety Check-in'),
        ('DESTINATION_VISIT', 'Destination QR Visit'),
        ('LOCATION_UPDATE', 'GPS Location Update'),
        ('JOURNEY_START', 'Journey Started'),
        ('JOURNEY_END', 'Journey Completed'),
    )

    SAFETY_CHECKS = (
        ('safe', 'Safe'),
        ('caution', 'Caution Area'),
        ('danger', 'Hazard / Danger Warning'),
    )

    journey = models.ForeignKey(
        Journey,
        on_delete=models.CASCADE,
        related_name='locations'
    )
    tourist = models.ForeignKey(
        TouristProfile,
        on_delete=models.CASCADE,
        related_name='journey_locations'
    )
    destination = models.ForeignKey(
        Destination,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='journey_events'
    )
    location_name = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()

    event_type = models.CharField(max_length=30, choices=EVENT_TYPES, default='CHECK_IN')
    status = models.CharField(max_length=20, default='ongoing')
    safety_check = models.CharField(max_length=20, choices=SAFETY_CHECKS, default='safe')
    notes = models.TextField(blank=True, default='')

    timestamp = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        verbose_name = 'Journey Location Log'
        verbose_name_plural = 'Journey Location Logs'
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.tourist.full_name} at {self.location_name} ({self.event_type}) - {self.timestamp.strftime('%Y-%m-%d %H:%M')}"


class CheckInSchedule(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending Check-in'),
        ('COMPLETED', 'Completed On Time'),
        ('MISSED', 'Missed Check-in'),
        ('ESCALATED', 'Escalated to Emergency Contacts'),
    )

    journey = models.ForeignKey(
        Journey,
        on_delete=models.CASCADE,
        related_name='check_in_schedules'
    )
    tourist = models.ForeignKey(
        TouristProfile,
        on_delete=models.CASCADE,
        related_name='check_in_schedules'
    )
    expected_check_in_time = models.DateTimeField(db_index=True)
    actual_check_in_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Check-in Schedule'
        verbose_name_plural = 'Check-in Schedules'
        ordering = ['expected_check_in_time']
