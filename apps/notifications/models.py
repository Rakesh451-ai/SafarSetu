from django.contrib.auth.models import User
from django.db import models


class NotificationType(models.TextChoices):
    ALERT = "ALERT", "Emergency Alert"
    SOS = "SOS", "SOS Broadcast"
    SYSTEM = "SYSTEM", "System Update"
    INFO = "INFO", "Informational"


class Notification(models.Model):
    recipient = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="notifications"
    )
    title = models.CharField(max_length=150)
    message = models.TextField()
    notification_type = models.CharField(
        max_length=20, choices=NotificationType.choices, default=NotificationType.INFO
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.notification_type}: {self.title} to {self.recipient.username}"
