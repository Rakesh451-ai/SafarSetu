from django.contrib.gis.geos import Polygon
from django.core.management.base import BaseCommand

from apps.tracking.models import Zone, ZoneType


class Command(BaseCommand):
    help = "Seeds 3 sample geofence zones (Safe, Caution, Danger) around Amber Fort POI in Jaipur."

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.NOTICE(
                "Seeding sample geofence zones around Amber Fort, Jaipur..."
            )
        )

        # Zone 1: Safe Zone (Main Tourist Enclave)
        safe_poly = Polygon(
            (
                (75.8490, 26.9830),
                (75.8540, 26.9830),
                (75.8540, 26.9880),
                (75.8490, 26.9880),
                (75.8490, 26.9830),
            ),
            srid=4326,
        )
        safe_zone, created1 = Zone.objects.update_or_create(
            name="Amber Fort Tourist Heritage Precinct",
            defaults={
                "type": ZoneType.SAFE,
                "region": "Jaipur",
                "boundary": safe_poly,
                "description": (
                    "Well-lit and secure main tourist enclave encompassing Jaleb Chowk, "
                    "Diwan-i-Aam, and ticket offices with active tourist police presence."
                ),
            },
        )

        # Zone 2: Caution Zone (Mountain Trail / Ridge)
        caution_poly = Polygon(
            (
                (75.8440, 26.9810),
                (75.8489, 26.9810),
                (75.8489, 26.9890),
                (75.8440, 26.9890),
                (75.8440, 26.9810),
            ),
            srid=4326,
        )
        caution_zone, created2 = Zone.objects.update_or_create(
            name="Jaigarh-Amber Mountain Trail & Ridge",
            defaults={
                "type": ZoneType.CAUTION,
                "region": "Jaipur",
                "boundary": caution_poly,
                "description": (
                    "Steep connecting hill trail between Amber Palace and Jaigarh Fort. "
                    "Uneven stone stairs, aggressive langurs, and unlit pathways after dusk."
                ),
            },
        )

        # Zone 3: Danger Zone (Restricted Cliffside / Drop-off)
        danger_poly = Polygon(
            (
                (75.8380, 26.9800),
                (75.8439, 26.9800),
                (75.8439, 26.9900),
                (75.8380, 26.9900),
                (75.8380, 26.9800),
            ),
            srid=4326,
        )
        danger_zone, created3 = Zone.objects.update_or_create(
            name="Cheel Ka Teela Restricted Cliffside & Unfenced Ramparts",
            defaults={
                "type": ZoneType.DANGER,
                "region": "Jaipur",
                "boundary": danger_poly,
                "description": (
                    "High-risk steep cliff edges with 400m vertical drop, crumbling medieval "
                    "outer fortifications, and restricted forest reserve prohibited to tourists."
                ),
            },
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully seeded 3 zones in Jaipur:\n"
                f" - [SAFE]    {safe_zone.name} ({safe_zone.zone_id})\n"
                f" - [CAUTION] {caution_zone.name} ({caution_zone.zone_id})\n"
                f" - [DANGER]  {danger_zone.name} ({danger_zone.zone_id})"
            )
        )
