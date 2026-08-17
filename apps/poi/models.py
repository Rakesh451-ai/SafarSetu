import uuid

from django.db import models

from apps.tracking.geo_fields import CompatiblePointField


class TransportMode(models.TextChoices):
    TAXI = "taxi", "Pre-Paid Taxi"
    AUTO = "auto", "Auto-Rickshaw"
    BUS = "bus", "Public / Tourist AC Bus"
    METRO = "metro", "Jaipur Metro"
    WALK = "walk", "Walking Trail"


class AccommodationType(models.TextChoices):
    HOTEL = "hotel", "Heritage / Boutique Hotel"
    HOMESTAY = "homestay", "Verified Homestay"
    HOSTEL = "hostel", "Backpacker Hostel"


class POI(models.Model):
    poi_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(
        max_length=200, help_text="Name of the heritage destination / landmark"
    )
    category = models.CharField(
        max_length=100,
        default="Heritage Monument",
        help_text="Category, e.g. Fort, Palace, Stepwell, Astronomy, Temple",
    )
    region = models.CharField(
        max_length=100,
        default="Jaipur",
        db_index=True,
        help_text="Operational jurisdiction / tourist circuit region",
    )
    city = models.CharField(max_length=100, default="Jaipur")
    description = models.TextField(blank=True)
    history = models.TextField(
        blank=True, help_text="Detailed archaeological & historical background"
    )
    facilities = models.JSONField(
        default=list,
        blank=True,
        help_text="List of available tourist amenities at the venue",
    )
    latitude = models.DecimalField(max_digits=9, decimal_places=6, default=26.985500)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, default=75.851300)
    location = CompatiblePointField(
        null=True,
        blank=True,
        help_text="Spatial Point representation for PostGIS distance queries",
    )
    entry_fee_info = models.CharField(
        max_length=150,
        default="₹100 (Indian) • ₹500 (Foreign)",
        help_text="Official standard entry ticket tariff",
    )
    best_time_to_visit = models.CharField(
        max_length=150,
        default="October to March, 8:00 AM – 11:00 AM",
        help_text="Recommended season & time of day",
    )
    avg_visit_duration_minutes = models.PositiveIntegerField(
        default=120,
        help_text="Average time required to explore this landmark in minutes",
    )
    is_hidden_gem = models.BooleanField(
        default=False,
        db_index=True,
        help_text="Distinguishes offbeat/lesser-known spots from famous landmarks",
    )
    entry_gate_qr_id = models.CharField(
        max_length=100,
        unique=True,
        db_index=True,
        help_text="Unique QR ID placed at the physical gate of this monument",
    )
    short_video_url = models.URLField(
        max_length=500,
        blank=True,
        help_text="Short autoplaying video background preview (S3/CDN hosted)",
    )
    three_sixty_media_url = models.URLField(
        max_length=500,
        blank=True,
        help_text="URL to 360-degree interactive panorama or virtual tour",
    )
    images = models.JSONField(
        default=list,
        blank=True,
        help_text="List of curated image gallery URLs",
    )
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.80)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["is_hidden_gem", "-rating", "name"]
        verbose_name = "Point of Interest"
        verbose_name_plural = "Points of Interest"

    def __str__(self):
        gem_tag = " [Hidden Gem]" if self.is_hidden_gem else ""
        return (
            f"{self.name}{gem_tag} ({self.region}) - Gate QR: {self.entry_gate_qr_id}"
        )


class TransportOption(models.Model):
    transport_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    poi = models.ForeignKey(
        POI, on_delete=models.CASCADE, related_name="transport_options"
    )
    mode = models.CharField(
        max_length=20, choices=TransportMode.choices, default=TransportMode.TAXI
    )
    from_landmark = models.CharField(
        max_length=200,
        help_text="Origin point, e.g. 'Jaipur Junction Railway Station' or 'Jaipur International Airport'",
    )
    estimated_price_range = models.CharField(
        max_length=100,
        help_text="Regulated tariff estimate range, e.g. '₹350 – ₹450' or '₹30 – ₹50 (Bus)'",
    )
    estimated_duration = models.CharField(
        max_length=100, help_text="Estimated travel time, e.g. '30-40 mins'"
    )
    verified = models.BooleanField(
        default=True, help_text="Verified against government pre-paid transport tariffs"
    )
    source_verified_by = models.CharField(
        max_length=150,
        default="Rajasthan State Transport Authority (RSTA) Tariff 2026",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["mode", "estimated_price_range"]

    def __str__(self):
        return f"{self.get_mode_display()} from {self.from_landmark} to {self.poi.name} ({self.estimated_price_range})"


class AccommodationOption(models.Model):
    accommodation_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    poi = models.ForeignKey(
        POI, on_delete=models.CASCADE, related_name="accommodation_options"
    )
    name = models.CharField(max_length=200)
    type = models.CharField(
        max_length=20,
        choices=AccommodationType.choices,
        default=AccommodationType.HOTEL,
    )
    price_range = models.CharField(
        max_length=100, help_text="Price range, e.g. '₹2,200 – ₹4,500 / night'"
    )
    distance_from_poi = models.CharField(
        max_length=100, help_text="Distance, e.g. '350m from Suraj Pol Gate'"
    )
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.70)
    verified = models.BooleanField(
        default=True, help_text="Verified heritage license with police registry"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-rating", "name"]

    def __str__(self):
        return f"{self.name} ({self.get_type_display()}) near {self.poi.name} - {self.distance_from_poi}"
