from django.db import models
from tourists.models import TouristProfile
from destinations.models import Destination


class QRScanLog(models.Model):
    SCAN_TYPES = (
        ('DESTINATION', 'Destination Monument QR'),
        ('DIGITAL_ID', 'Tourist Digital ID Check'),
        ('SERVICE', 'Verified Service QR'),
        ('OTHER', 'General QR'),
    )

    tourist = models.ForeignKey(
        TouristProfile,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='qr_scans'
    )
    destination = models.ForeignKey(
        Destination,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='qr_scans'
    )
    qr_code_scanned = models.CharField(max_length=255, db_index=True)
    scan_type = models.CharField(max_length=20, choices=SCAN_TYPES, default='DESTINATION')
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    scanned_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        verbose_name = 'QR Scan Log'
        verbose_name_plural = 'QR Scan Logs'
        ordering = ['-scanned_at']

    def __str__(self):
        dest_name = self.destination.name if self.destination else self.qr_code_scanned
        return f"Scan: {dest_name} by {self.tourist or 'Anonymous'} at {self.scanned_at.strftime('%Y-%m-%d %H:%M')}"
