from django.contrib.auth.models import User
from django.db import models

from apps.identity.models import Tourist


class GuideProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="guide_profile"
    )
    bio = models.TextField(blank=True)
    languages_spoken = models.CharField(
        max_length=255,
        default="",
        blank=True,
        help_text="Comma-separated languages spoken, e.g. English, Hindi, French",
    )
    verified = models.BooleanField(
        default=False,
        db_index=True,
        help_text="Designates whether this guide has been officially verified by an admin",
    )
    verified_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="verified_guides",
    )
    regions_served = models.CharField(
        max_length=255,
        default="",
        blank=True,
        help_text="Comma-separated regions or operational zones, e.g. Jaipur, Rajasthan, Delhi",
    )
    rating_avg = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    experience_years = models.PositiveIntegerField(default=1)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-rating_avg", "-created_at"]

    def __str__(self):
        status = "Verified" if self.verified else "Unverified"
        return f"Guide: {self.user.get_full_name() or self.user.username} ({status}) [{self.regions_served}]"


class TourPackage(models.Model):
    guide = models.ForeignKey(
        GuideProfile, on_delete=models.CASCADE, related_name="tour_packages"
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    poi_refs = models.ManyToManyField(
        "listings.Listing",
        blank=True,
        related_name="tour_packages",
        help_text="Points of interest / destination listings included in this tour",
    )
    duration = models.CharField(
        max_length=100,
        default="Half Day",
        help_text="Duration description, e.g. '4 hours', '1 day', '3 days'",
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)
    max_group_size = models.PositiveIntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} by {self.guide.user.username} (₹{self.price})"


class BookingStatus(models.TextChoices):
    REQUESTED = "requested", "Requested"
    CONFIRMED = "confirmed", "Confirmed"
    COMPLETED = "completed", "Completed"
    CANCELLED = "cancelled", "Cancelled"


class GuideBooking(models.Model):
    tourist = models.ForeignKey(
        Tourist, on_delete=models.CASCADE, related_name="guide_bookings"
    )
    tour_package = models.ForeignKey(
        TourPackage, on_delete=models.CASCADE, related_name="bookings"
    )
    status = models.CharField(
        max_length=20,
        choices=BookingStatus.choices,
        default=BookingStatus.REQUESTED,
        db_index=True,
    )
    scheduled_date = models.DateField()
    number_of_people = models.PositiveIntegerField(default=1)
    special_requests = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return (
            f"Booking #{self.id} for {self.tour_package.title} by "
            f"{self.tourist.name} [{self.get_status_display()}] on {self.scheduled_date}"
        )
