from django.db import models
from django.conf import settings
from .utils import generate_digital_tourist_id


class TouristProfile(models.Model):
    STATUS_CHOICES = (
        ('verified', 'Verified'),
        ('pending', 'Pending Verification'),
        ('unverified', 'Unverified'),
    )

    SAFETY_CHOICES = (
        ('safe', 'Safe'),
        ('caution', 'Caution'),
        ('danger', 'Danger / SOS Active'),
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tourist_profile'
    )
    digital_id = models.CharField(
        max_length=32,
        unique=True,
        db_index=True,
        editable=False,
        default=generate_digital_tourist_id
    )
    full_name = models.CharField(max_length=255)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=25, blank=True)
    nationality = models.CharField(max_length=100, default='Indian')
    passport_hash = models.CharField(max_length=64, blank=True, default='P••••••••3291')
    aadhaar_hash = models.CharField(max_length=64, blank=True, default='XXXX-XXXX-4819')
    gender = models.CharField(max_length=20, default='Male')
    dob = models.DateField(null=True, blank=True)
    blood_group = models.CharField(max_length=20, default='O+ Positive')
    medical_notes = models.TextField(blank=True, default='No known allergies.')
    avatar_url = models.CharField(
        max_length=500,
        default='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    )
    verification_status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='verified'
    )
    verified_by = models.CharField(
        max_length=255,
        default='Ministry of Tourism, Govt of India & UP Tourist Police'
    )
    safety_status = models.CharField(
        max_length=20,
        choices=SAFETY_CHOICES,
        default='safe'
    )
    check_in_due_minutes = models.IntegerField(default=60)
    last_check_in_time = models.DateTimeField(null=True, blank=True)
    last_check_in_location = models.CharField(max_length=255, blank=True, default='Taj East Gate Geofence')
    last_latitude = models.FloatField(null=True, blank=True, default=27.1751)
    last_longitude = models.FloatField(null=True, blank=True, default=78.0421)

    # Privacy Settings
    share_live_location = models.BooleanField(default=True)
    auto_alert_on_missed_check_in = models.BooleanField(default=True)
    allow_emergency_service_beacon = models.BooleanField(default=True)
    anonymous_safety_metrics = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Tourist Profile'
        verbose_name_plural = 'Tourist Profiles'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name} ({self.digital_id})"

    def save(self, *args, **kwargs):
        if not self.digital_id:
            self.digital_id = generate_digital_tourist_id()
        if not self.email and self.user:
            self.email = self.user.email
        if not self.full_name and self.user:
            self.full_name = self.user.get_full_name() or self.user.username
        super().save(*args, **kwargs)


class EmergencyContact(models.Model):
    tourist = models.ForeignKey(
        TouristProfile,
        on_delete=models.CASCADE,
        related_name='emergency_contacts'
    )
    name = models.CharField(max_length=255)
    relationship = models.CharField(max_length=100)
    phone = models.CharField(max_length=25)
    email = models.EmailField(blank=True)
    is_primary = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Emergency Contact'
        verbose_name_plural = 'Emergency Contacts'
        ordering = ['-is_primary', 'name']

    def __str__(self):
        return f"{self.name} ({self.relationship}) - {self.phone}"
