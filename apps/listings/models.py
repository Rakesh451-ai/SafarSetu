from django.contrib.auth.models import User
from django.db import models


class ListingType(models.TextChoices):
    HOTEL = "hotel", "Hotel & Stay"
    TRANSPORT = "transport", "Verified Transport"
    ENTRY_FEE = "entry_fee", "Monument & Attraction Entry Fee"
    ATTRACTION = "attraction", "Heritage Attraction & POI"


class ListingCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Icon identifier")

    class Meta:
        verbose_name_plural = "Listing Categories"

    def __str__(self):
        return self.name


class Listing(models.Model):
    category = models.ForeignKey(
        ListingCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="listings",
    )
    type = models.CharField(
        max_length=20,
        choices=ListingType.choices,
        default=ListingType.ATTRACTION,
        db_index=True,
        help_text="Listing category type [hotel|transport|entry_fee|attraction]",
    )
    title = models.CharField(max_length=200, help_text="Name/title of the listing")
    region = models.CharField(
        max_length=100,
        default="Jaipur",
        db_index=True,
        help_text="Operational region/jurisdiction (e.g., Jaipur, Amer)",
    )
    description = models.TextField(blank=True)
    city = models.CharField(max_length=100, default="Jaipur")
    address = models.CharField(max_length=255, blank=True)
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    price_info = models.CharField(
        max_length=100,
        blank=True,
        help_text="Standardized price info, e.g. '₹500 / person', '₹2200 / night', '₹15 / km'",
    )
    price_level = models.CharField(
        max_length=10, default="$$", help_text="e.g. $, $$, $$$, $$$$"
    )
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    verified = models.BooleanField(
        default=False,
        db_index=True,
        help_text="Designates whether this listing data has been verified by staff/authorities",
    )
    source_verified_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="verified_listings",
        help_text="Admin user who verified this listing",
    )
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-verified", "-rating", "-updated_at"]

    @property
    def name(self) -> str:
        return self.title

    @name.setter
    def name(self, value: str):
        self.title = value

    def __str__(self):
        status = "Verified" if self.verified else "Unverified"
        return f"[{self.get_type_display()}] {self.title} ({self.region}) - {status}"


class Review(models.Model):
    listing = models.ForeignKey(
        Listing, on_delete=models.CASCADE, related_name="reviews"
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")
    rating = models.PositiveSmallIntegerField(default=5)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.user.username} for {self.listing.title}"
