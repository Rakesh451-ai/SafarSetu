from django.db import models
from tourists.models import TouristProfile
from journeys.models import Journey
from destinations.models import Destination


class Itinerary(models.Model):
    tourist = models.ForeignKey(
        TouristProfile,
        on_delete=models.CASCADE,
        related_name='itineraries'
    )
    journey = models.ForeignKey(
        Journey,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='itineraries'
    )
    name = models.CharField(max_length=255, default='Personalized Heritage Trip')
    description = models.TextField(blank=True, default='')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Itinerary'
        verbose_name_plural = 'Itineraries'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.tourist.full_name})"


class ItineraryItem(models.Model):
    TRANSPORT_CHOICES = (
        ('walk', 'Walking'),
        ('cab', 'Pre-paid Cab / Taxi'),
        ('metro', 'Rapid Metro'),
        ('auto', 'E-Rickshaw / Auto'),
    )

    SAFETY_CHOICES = (
        ('safe', 'Safe Area'),
        ('caution', 'Caution / High Density'),
    )

    itinerary = models.ForeignKey(
        Itinerary,
        on_delete=models.CASCADE,
        related_name='items'
    )
    destination = models.ForeignKey(
        Destination,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='itinerary_items'
    )
    day = models.IntegerField(default=1)
    order = models.IntegerField(default=1)
    time = models.CharField(max_length=50, default='09:00 AM')

    title = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    duration = models.CharField(max_length=50, default='2 hours')

    transport_mode = models.CharField(max_length=20, choices=TRANSPORT_CHOICES, default='cab')
    travel_time_from_prev = models.CharField(max_length=50, blank=True, default='15 mins')
    distance_from_prev = models.CharField(max_length=50, blank=True, default='4.5 km')
    cost = models.FloatField(default=0.0)

    safety_status = models.CharField(max_length=20, choices=SAFETY_CHOICES, default='safe')
    recommended_hours = models.CharField(max_length=255, blank=True, default='Morning hours')
    notes = models.TextField(blank=True, default='')

    latitude = models.FloatField(default=27.1751)
    longitude = models.FloatField(default=78.0421)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Itinerary Item'
        verbose_name_plural = 'Itinerary Items'
        ordering = ['day', 'order']

    def __str__(self):
        return f"Day {self.day} #{self.order}: {self.title} ({self.time})"
