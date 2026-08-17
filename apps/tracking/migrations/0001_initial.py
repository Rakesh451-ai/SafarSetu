import uuid

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models

import apps.tracking.geo_fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("identity", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Zone",
            fields=[
                (
                    "zone_id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("name", models.CharField(max_length=150)),
                (
                    "type",
                    models.CharField(
                        choices=[
                            ("safe", "Safe"),
                            ("caution", "Caution"),
                            ("danger", "Danger"),
                        ],
                        db_index=True,
                        default="safe",
                        max_length=20,
                    ),
                ),
                (
                    "boundary",
                    apps.tracking.geo_fields.CompatiblePolygonField(
                        help_text="Polygon boundary in WGS84 coordinates",
                        srid=4326,
                    ),
                ),
                (
                    "region",
                    models.CharField(
                        db_index=True,
                        help_text="e.g. Jaipur, Delhi, Agra",
                        max_length=100,
                    ),
                ),
                ("description", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "ordering": ["region", "name"],
            },
        ),
        migrations.CreateModel(
            name="LocationPing",
            fields=[
                (
                    "ping_id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "location",
                    apps.tracking.geo_fields.CompatiblePointField(
                        default="POINT(0 0)",
                        help_text="GPS Point (Longitude, Latitude) in WGS84",
                        srid=4326,
                    ),
                ),
                (
                    "timestamp",
                    models.DateTimeField(
                        db_index=True, default=django.utils.timezone.now
                    ),
                ),
                (
                    "zone_status_at_ping",
                    models.CharField(
                        choices=[
                            ("safe", "Safe"),
                            ("caution", "Caution"),
                            ("danger", "Danger"),
                        ],
                        db_index=True,
                        default="safe",
                        max_length=20,
                    ),
                ),
                (
                    "accuracy_meters",
                    models.FloatField(blank=True, null=True),
                ),
                (
                    "tourist",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="location_pings",
                        to="identity.tourist",
                    ),
                ),
            ],
            options={
                "ordering": ["-timestamp"],
            },
        ),
    ]
