import uuid

from django.contrib.auth.models import User
from django.db import models

from apps.identity.models import Tourist


class MessageRole(models.TextChoices):
    USER = "USER", "User"
    ASSISTANT = "ASSISTANT", "Assistant"
    SYSTEM = "SYSTEM", "System"


class AssistantConversation(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="assistant_conversations"
    )
    title = models.CharField(max_length=150, default="New Conversation")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return f"{self.user.username}: {self.title}"


class AssistantMessage(models.Model):
    conversation = models.ForeignKey(
        AssistantConversation, on_delete=models.CASCADE, related_name="messages"
    )
    role = models.CharField(
        max_length=20, choices=MessageRole.choices, default=MessageRole.USER
    )
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["timestamp"]

    def __str__(self):
        return f"[{self.role}] in Conv #{self.conversation_id}: {self.content[:30]}..."


class Itinerary(models.Model):
    itinerary_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    tourist = models.ForeignKey(
        Tourist, on_delete=models.CASCADE, related_name="itineraries"
    )
    title = models.CharField(max_length=200)
    destination_city = models.CharField(max_length=100, default="Jaipur")
    duration_days = models.PositiveIntegerField(default=1)
    interests = models.JSONField(
        default=list, help_text="List of tourist interest tags"
    )
    day_by_day_plan = models.JSONField(
        default=list, help_text="Structured day-by-day itinerary schedule"
    )
    safety_assessment = models.JSONField(
        default=dict,
        help_text="Safety assessment and geofence zone analysis for candidate POIs",
    )
    suggested_packages = models.ManyToManyField(
        "guide.TourPackage",
        blank=True,
        related_name="suggested_itineraries",
        help_text="Matching verified guide tour packages",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} ({self.duration_days} Days) for {self.tourist.name}"
