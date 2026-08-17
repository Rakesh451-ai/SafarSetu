import uuid

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        (
            "guide",
            "0002_alter_guideprofile_options_alter_tourpackage_options_and_more",
        ),
        ("identity", "0002_tourist_emergencycontact_digitalid"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="AssistantConversation",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "title",
                    models.CharField(default="New Conversation", max_length=150),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="assistant_conversations",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ["-updated_at"],
            },
        ),
        migrations.CreateModel(
            name="AssistantMessage",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "role",
                    models.CharField(
                        choices=[
                            ("USER", "User"),
                            ("ASSISTANT", "Assistant"),
                            ("SYSTEM", "System"),
                        ],
                        default="USER",
                        max_length=20,
                    ),
                ),
                ("content", models.TextField()),
                ("timestamp", models.DateTimeField(auto_now_add=True)),
                (
                    "conversation",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="messages",
                        to="assistant.assistantconversation",
                    ),
                ),
            ],
            options={
                "ordering": ["timestamp"],
            },
        ),
        migrations.CreateModel(
            name="Itinerary",
            fields=[
                (
                    "itinerary_id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("title", models.CharField(max_length=200)),
                (
                    "destination_city",
                    models.CharField(default="Jaipur", max_length=100),
                ),
                ("duration_days", models.PositiveIntegerField(default=1)),
                (
                    "interests",
                    models.JSONField(
                        default=list, help_text="List of tourist interest tags"
                    ),
                ),
                (
                    "day_by_day_plan",
                    models.JSONField(
                        default=list,
                        help_text="Structured day-by-day itinerary schedule",
                    ),
                ),
                (
                    "safety_assessment",
                    models.JSONField(
                        default=dict,
                        help_text="Safety assessment and geofence zone analysis for candidate POIs",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "suggested_packages",
                    models.ManyToManyField(
                        blank=True,
                        help_text="Matching verified guide tour packages",
                        related_name="suggested_itineraries",
                        to="guide.tourpackage",
                    ),
                ),
                (
                    "tourist",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="itineraries",
                        to="identity.tourist",
                    ),
                ),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
    ]
