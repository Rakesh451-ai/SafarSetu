import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="ListingCategory",
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
                ("name", models.CharField(max_length=100, unique=True)),
                ("slug", models.SlugField(max_length=100, unique=True)),
                (
                    "icon",
                    models.CharField(
                        blank=True, help_text="Icon identifier", max_length=50
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "Listing Categories",
            },
        ),
        migrations.CreateModel(
            name="Listing",
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
                    "type",
                    models.CharField(
                        choices=[
                            ("hotel", "Hotel & Stay"),
                            ("transport", "Verified Transport"),
                            ("entry_fee", "Monument & Attraction Entry Fee"),
                            ("attraction", "Heritage Attraction & POI"),
                        ],
                        db_index=True,
                        default="attraction",
                        help_text="Listing category type [hotel|transport|entry_fee|attraction]",
                        max_length=20,
                    ),
                ),
                (
                    "title",
                    models.CharField(
                        help_text="Name/title of the listing", max_length=200
                    ),
                ),
                (
                    "region",
                    models.CharField(
                        db_index=True,
                        default="Jaipur",
                        help_text="Operational region/jurisdiction (e.g., Jaipur, Amer)",
                        max_length=100,
                    ),
                ),
                ("description", models.TextField(blank=True)),
                ("city", models.CharField(default="Jaipur", max_length=100)),
                ("address", models.CharField(blank=True, max_length=255)),
                (
                    "latitude",
                    models.DecimalField(
                        blank=True, decimal_places=6, max_digits=9, null=True
                    ),
                ),
                (
                    "longitude",
                    models.DecimalField(
                        blank=True, decimal_places=6, max_digits=9, null=True
                    ),
                ),
                (
                    "price_info",
                    models.CharField(
                        blank=True,
                        help_text="Standardized price info, e.g. '₹500 / person', '₹2200 / night', '₹15 / km'",
                        max_length=100,
                    ),
                ),
                (
                    "price_level",
                    models.CharField(
                        default="$$", help_text="e.g. $, $$, $$$, $$$$", max_length=10
                    ),
                ),
                (
                    "rating",
                    models.DecimalField(decimal_places=2, default=5.0, max_digits=3),
                ),
                (
                    "verified",
                    models.BooleanField(
                        db_index=True,
                        default=False,
                        help_text="Designates whether this listing data has been verified by staff/authorities",
                    ),
                ),
                ("is_active", models.BooleanField(db_index=True, default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "category",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="listings",
                        to="listings.listingcategory",
                    ),
                ),
                (
                    "source_verified_by",
                    models.ForeignKey(
                        blank=True,
                        help_text="Admin user who verified this listing",
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="verified_listings",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ["-verified", "-rating", "-updated_at"],
            },
        ),
        migrations.CreateModel(
            name="Review",
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
                ("rating", models.PositiveSmallIntegerField(default=5)),
                ("comment", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "listing",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="reviews",
                        to="listings.listing",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="reviews",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
