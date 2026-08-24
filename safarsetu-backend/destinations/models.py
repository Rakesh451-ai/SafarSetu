from django.db import models
from django.utils.text import slugify


class Destination(models.Model):
    CATEGORY_CHOICES = (
        ('heritage', 'Heritage & Monument'),
        ('nature', 'Nature & Wildlife'),
        ('spiritual', 'Spiritual & Pilgrimage'),
        ('adventure', 'Adventure & Trekking'),
        ('coastal', 'Coastal & Beach'),
    )

    CROWD_CHOICES = (
        ('low', 'Low'),
        ('moderate', 'Moderate'),
        ('high', 'High Peak'),
    )

    STATUS_CHOICES = (
        ('verified', 'Verified by ASI / Ministry'),
        ('pending', 'Pending Verification'),
    )

    name = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    tagline = models.CharField(max_length=500, blank=True)
    city = models.CharField(max_length=100, db_index=True)
    state = models.CharField(max_length=100, db_index=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='heritage', db_index=True)

    rating = models.FloatField(default=4.8)
    reviews_count = models.IntegerField(default=0)
    safety_rating = models.FloatField(default=4.8)

    image = models.CharField(max_length=500)
    gallery = models.JSONField(default=list, blank=True)

    description = models.TextField()
    history = models.TextField(blank=True)
    opening_hours = models.CharField(max_length=255, default='06:00 AM – 06:30 PM')
    opening_time = models.TimeField(null=True, blank=True)
    closing_time = models.TimeField(null=True, blank=True)
    best_time_to_visit = models.CharField(max_length=255, blank=True, default='October to March')

    # Structured JSON data
    entry_fee = models.JSONField(
        default=dict,
        blank=True,
        help_text='{"domestic": 50, "international": 1100, "camera": 25}'
    )
    accessibility = models.JSONField(
        default=dict,
        blank=True,
        help_text='{"wheelchairAccessible": true, "audioAssistance": true, "brailleSignage": true, "batteryCars": true, "specialWashrooms": true}'
    )
    facilities = models.JSONField(default=list, blank=True)
    safety_guidelines = models.JSONField(default=list, blank=True)
    dos_and_donts = models.JSONField(
        default=dict,
        blank=True,
        help_text='{"dos": [...], "donts": [...]}'
    )
    weather = models.JSONField(
        default=dict,
        blank=True,
        help_text='{"temp": 28, "condition": "Clear", "aqi": 85, "aqiStatus": "Good"}'
    )

    crowd_status = models.CharField(max_length=20, choices=CROWD_CHOICES, default='moderate')
    crowd_percentage = models.IntegerField(default=50)

    # Geographic coordinates (Latitude & Longitude in WGS84)
    latitude = models.FloatField(db_index=True)
    longitude = models.FloatField(db_index=True)

    qr_code = models.CharField(max_length=100, unique=True, db_index=True)
    panorama_url = models.CharField(max_length=500, blank=True, default='')

    verification_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='verified')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Destination'
        verbose_name_plural = 'Destinations'
        ordering = ['-rating', 'name']

    def __str__(self):
        return f"{self.name} ({self.city}, {self.state})"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        if not self.qr_code:
            self.qr_code = f"SAFARSETU-DEST-{self.slug.upper()[:12]}"
        super().save(*args, **kwargs)


class AudioGuideTrack(models.Model):
    destination = models.ForeignKey(
        Destination,
        on_delete=models.CASCADE,
        related_name='audio_guides'
    )
    language = models.CharField(max_length=50, default='English')
    title = models.CharField(max_length=255)
    duration = models.CharField(max_length=20, default='10:00')
    duration_seconds = models.IntegerField(default=600)
    audio_url = models.CharField(max_length=500)
    transcript = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Audio Guide Track'
        verbose_name_plural = 'Audio Guide Tracks'

    def __str__(self):
        return f"{self.destination.name} - {self.language}: {self.title}"


class DestinationReview(models.Model):
    destination = models.ForeignKey(
        Destination,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    author = models.CharField(max_length=255)
    nationality = models.CharField(max_length=100, default='Indian')
    rating = models.IntegerField(default=5)
    date = models.CharField(max_length=50, default='Recently')
    comment = models.TextField()
    verified_stay = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Destination Review'
        verbose_name_plural = 'Destination Reviews'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.author} on {self.destination.name} ({self.rating}★)"


class NearbyAttraction(models.Model):
    destination = models.ForeignKey(
        Destination,
        on_delete=models.CASCADE,
        related_name='nearby_attractions'
    )
    name = models.CharField(max_length=255)
    distance = models.CharField(max_length=50)
    image = models.CharField(max_length=500, blank=True)

    class Meta:
        verbose_name = 'Nearby Attraction'
        verbose_name_plural = 'Nearby Attractions'

    def __str__(self):
        return f"{self.name} ({self.distance} from {self.destination.name})"
