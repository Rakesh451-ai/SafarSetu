import uuid

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models

import apps.tracking.geo_fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("identity", "0002_tourist_emergencycontact_digitalid"),
    ]

    operations = [
        migrations.CreateModel(
            name="SOSEvent",
            fields=[
                (
                    "sos_id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "trigger_type",
                    models.CharField(
                        choices=[
                            ("manual", "Manual Tourist Trigger"),
                            ("missed_checkin", "Automated Missed Check-in"),
                        ],
                        db_index=True,
                        default="manual",
                        max_length=20,
                    ),
                ),
                (
                    "location",
                    apps.tracking.geo_fields.CompatiblePointField(
                        default="POINT(0 0)",
                        help_text="GPS Coordinates (Longitude, Latitude) when SOS was triggered",
                        srid=4326,
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("active", "Active"),
                            ("acknowledged", "Acknowledged"),
                            ("resolved", "Resolved"),
                            ("false_alarm", "False Alarm"),
                        ],
                        db_index=True,
                        default="active",
                        max_length=20,
                    ),
                ),
                (
                    "notes",
                    models.TextField(
                        blank=True,
                        help_text="Distress notes or automated trigger details",
                    ),
                ),
                ("responder_notes", models.TextField(blank=True)),
                (
                    "created_at",
                    models.DateTimeField(
                        db_index=True, default=django.utils.timezone.now
                    ),
                ),
                ("resolved_at", models.DateTimeField(blank=True, null=True)),
                (
                    "tourist",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="sos_events",
                        to="identity.tourist",
                    ),
                ),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="CheckInSchedule",
            fields=[
                (
                    "schedule_id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "expected_interval_minutes",
                    models.PositiveIntegerField(
                        default=60,
                        help_text="Required check-in frequency in minutes (e.g., 30, 60, 120)",
                    ),
                ),
                (
                    "last_checkin_at",
                    models.DateTimeField(default=django.utils.timezone.now),
                ),
                ("is_active", models.BooleanField(db_index=True, default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "tourist",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="checkin_schedule",
                        to="identity.tourist",
                    ),
                ),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
    ]
