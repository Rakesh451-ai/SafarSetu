import uuid

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("identity", "0002_tourist_emergencycontact_digitalid"),
        ("sos", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="SystemMetric",
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
                ("metric_name", models.CharField(db_index=True, max_length=100)),
                ("metric_value", models.FloatField()),
                ("recorded_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name="AuditLog",
            fields=[
                (
                    "log_id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "action",
                    models.CharField(
                        choices=[
                            ("LOCATION_LOOKUP", "Tourist Location Access"),
                            ("TOURIST_DETAIL_ACCESS", "Tourist Record View"),
                            ("INCIDENT_ASSIGN", "Emergency Incident Assignment"),
                            ("STATUS_CHANGE", "Emergency Incident Status Update"),
                            ("GEOFENCE_OVERRIDE", "Safety Geofence Override"),
                        ],
                        db_index=True,
                        default="LOCATION_LOOKUP",
                        max_length=50,
                    ),
                ),
                (
                    "reason",
                    models.TextField(
                        blank=True,
                        help_text="Operational justification (mandatory for privacy location access)",
                    ),
                ),
                (
                    "ip_address",
                    models.CharField(blank=True, default="", max_length=45),
                ),
                ("details", models.JSONField(blank=True, default=dict)),
                ("timestamp", models.DateTimeField(auto_now_add=True, db_index=True)),
                (
                    "target_incident",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="audit_logs",
                        to="sos.sosevent",
                    ),
                ),
                (
                    "target_tourist",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="audit_logs",
                        to="identity.tourist",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        help_text="Responder or Admin who performed the action",
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="audit_logs",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ["-timestamp"],
            },
        ),
    ]
