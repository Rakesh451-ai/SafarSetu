import uuid

from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class UserRole(models.TextChoices):
    TOURIST = "TOURIST", "Tourist"
    GUIDE = "GUIDE", "Local Guide"
    ADMIN = "ADMIN", "Administrator"
    RESPONDER = "RESPONDER", "Emergency Responder"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(
        max_length=20, choices=UserRole.choices, default=UserRole.TOURIST
    )
    phone_number = models.CharField(max_length=20, blank=True)
    region_scope = models.CharField(
        max_length=100,
        default="",
        blank=True,
        help_text="Jurisdiction region for RESPONDER/ADMIN (e.g., 'Jaipur', 'Amer', or blank for all regions)",
    )
    is_verified = models.BooleanField(default=False)
    emergency_contact_name = models.CharField(max_length=120, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        region_str = f" [{self.region_scope}]" if self.region_scope else " [Global]"
        return f"{self.user.username} ({self.get_role_display()}){region_str}"


class IDProofType(models.TextChoices):
    PASSPORT = "PASSPORT", "Passport"
    NATIONAL_ID = "NATIONAL_ID", "National Identity Card"
    DRIVING_LICENSE = "DRIVING_LICENSE", "Driving License"
    AADHAAR = "AADHAAR", "Aadhaar Card"
    OTHER = "OTHER", "Other Official ID"


class Tourist(models.Model):
    tourist_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, db_index=True
    )
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="tourist_profile",
    )
    name = models.CharField(max_length=200)
    nationality = models.CharField(max_length=100)
    id_proof_type = models.CharField(
        max_length=50, choices=IDProofType.choices, default=IDProofType.PASSPORT
    )
    id_proof_number = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=25)
    current_region = models.CharField(
        max_length=100,
        default="Jaipur",
        db_index=True,
        help_text="Current destination region for this tourist",
    )
    preferred_language = models.CharField(max_length=50, default="en")
    trip_start = models.DateField()
    trip_end = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Tourist: {self.name} ({self.nationality}) [{self.tourist_id}]"


class DigitalID(models.Model):
    id_token = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, db_index=True
    )
    tourist = models.ForeignKey(
        Tourist, on_delete=models.CASCADE, related_name="digital_ids"
    )
    qr_payload_signed = models.TextField(
        help_text="Signed PyJWT payload representing the verified tourist identity"
    )
    qr_image_base64 = models.TextField(
        blank=True, help_text="Cached Base64-encoded PNG image of the QR code"
    )
    issued_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-issued_at"]

    @property
    def is_expired(self) -> bool:
        return timezone.now() >= self.expires_at

    def __str__(self):
        return (
            f"DigitalID #{self.id_token} for {self.tourist.name} "
            f"({'Active' if self.is_active and not self.is_expired else 'Expired/Inactive'})"
        )


class EmergencyContact(models.Model):
    contact_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tourist = models.ForeignKey(
        Tourist, on_delete=models.CASCADE, related_name="emergency_contacts"
    )
    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=25)
    relation = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.relation}) -> {self.tourist.name}"
