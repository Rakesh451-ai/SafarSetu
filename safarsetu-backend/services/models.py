from django.db import models


class VerifiedService(models.Model):
    SERVICE_TYPES = (
        ('hotel', 'Verified Stay / Heritage Hotel'),
        ('transport', 'Certified Taxi / Transit'),
        ('guide', 'Official ASI / RTDC Heritage Guide'),
        ('ticket', 'Official Monument E-Ticket'),
        ('experience', 'Curated Cultural Experience'),
        ('restaurant', 'Verified Culinary / Dining'),
        ('other', 'Other Tourism Service'),
    )

    service_id = models.CharField(max_length=50, unique=True, db_index=True)
    title = models.CharField(max_length=255, db_index=True)
    service_type = models.CharField(max_length=30, choices=SERVICE_TYPES, default='guide', db_index=True)
    provider = models.CharField(max_length=255)
    license_number = models.CharField(max_length=100, blank=True, default='')

    location = models.CharField(max_length=255, db_index=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    rating = models.FloatField(default=4.9)
    reviews_count = models.IntegerField(default=0)
    price = models.FloatField(default=0.0)
    price_unit = models.CharField(max_length=100, default='per person')

    image = models.CharField(max_length=500)
    badge = models.CharField(max_length=100, default='✓ SafarSetu Verified')

    facilities = models.JSONField(default=list, blank=True)
    accessibility = models.JSONField(default=list, blank=True)
    cancellation_policy = models.TextField(blank=True, default='Free cancellation up to 24 hours prior.')

    is_verified = models.BooleanField(default=True, db_index=True)
    verified_date = models.CharField(max_length=100, default='Verified Quarterly Audit')
    languages = models.JSONField(default=list, blank=True)
    experience_years = models.IntegerField(null=True, blank=True, default=5)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Verified Service'
        verbose_name_plural = 'Verified Services'
        ordering = ['-rating', 'title']

    def __str__(self):
        return f"{self.title} - {self.provider} ({self.get_service_type_display()})"
