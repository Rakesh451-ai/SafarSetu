from django.db import models
from django.conf import settings


class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('SAFETY_ALERT', 'Safety Alert / Advisory'),
        ('SOS', 'Emergency SOS Broadcast'),
        ('CHECK_IN', 'Journey Check-in Reminder'),
        ('JOURNEY', 'Trip Update / Milestone'),
        ('SYSTEM', 'System Announcement'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(
        max_length=30,
        choices=NOTIFICATION_TYPES,
        default='SYSTEM',
        db_index=True
    )
    is_read = models.BooleanField(default=False, db_index=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.notification_type}] {self.title} -> {self.user.email}"
