from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from apps.listings.models import Listing, ListingCategory, ListingType


class Command(BaseCommand):
    help = "Seeds verified sample listings for hotels, transport, entry fees, and POIs in Jaipur/Amer."

    def handle(self, *args, **options):
        self.stdout.write("Seeding sample listings for Jaipur/Amer...")

        admin_user, _ = User.objects.get_or_create(
            username="admin_verifier",
            defaults={"email": "verifier@safarsetu.gov.in", "is_staff": True},
        )

        cat_hotel, _ = ListingCategory.objects.get_or_create(
            name="Heritage Hotels", defaults={"slug": "heritage-hotels"}
        )
        cat_trans, _ = ListingCategory.objects.get_or_create(
            name="Verified Transport", defaults={"slug": "verified-transport"}
        )
        cat_monument, _ = ListingCategory.objects.get_or_create(
            name="Monuments & Sites", defaults={"slug": "monuments-sites"}
        )

        sample_listings = [
            # 1. Hotels
            {
                "type": ListingType.HOTEL,
                "title": "Amer Heritage Haveli & Resort",
                "region": "Amer",
                "city": "Jaipur",
                "category": cat_hotel,
                "description": "Authentic Rajput haveli stay with courtyard dining, folk music, and Amber Fort views.",
                "address": "Near Maota Lake, Amer, Jaipur",
                "latitude": 26.9830,
                "longitude": 75.8500,
                "price_info": "₹3,500 / night",
                "price_level": "$$$",
                "rating": 4.8,
                "verified": True,
                "source_verified_by": admin_user,
            },
            {
                "type": ListingType.HOTEL,
                "title": "Pink City Palace View Inn",
                "region": "Jaipur",
                "city": "Jaipur",
                "category": cat_hotel,
                "description": "Boutique hotel in the walled city within walking distance of Hawa Mahal and City Palace.",
                "address": "Johari Bazaar Road, Jaipur",
                "latitude": 26.9210,
                "longitude": 75.8250,
                "price_info": "₹2,200 / night",
                "price_level": "$$",
                "rating": 4.6,
                "verified": True,
                "source_verified_by": admin_user,
            },
            # 2. Transport
            {
                "type": ListingType.TRANSPORT,
                "title": "Jaipur Pre-paid Auto-Rickshaw Union Stand",
                "region": "Jaipur",
                "city": "Jaipur",
                "category": cat_trans,
                "description": "Government tariff-regulated pre-paid auto stand at Jaipur Junction and Hawa Mahal.",
                "address": "Railway Station & Badi Choupad",
                "latitude": 26.9200,
                "longitude": 75.7900,
                "price_info": "₹15 / km (Govt Metered Tariff)",
                "price_level": "$",
                "rating": 4.7,
                "verified": True,
                "source_verified_by": admin_user,
            },
            {
                "type": ListingType.TRANSPORT,
                "title": "Amer Electric Shuttle & Jeep Syndicate",
                "region": "Amer",
                "city": "Jaipur",
                "category": cat_trans,
                "description": "Authorized battery-operated electric shuttle and 4x4 jeeps to Amber Fort main gate.",
                "address": "Amer Parking Ground to Suraj Pol",
                "latitude": 26.9820,
                "longitude": 75.8520,
                "price_info": "₹500 / vehicle (Round Trip)",
                "price_level": "$$",
                "rating": 4.9,
                "verified": True,
                "source_verified_by": admin_user,
            },
            # 3. Entry Fees
            {
                "type": ListingType.ENTRY_FEE,
                "title": "Amber Fort Official Monument Entry Ticket",
                "region": "Amer",
                "city": "Jaipur",
                "category": cat_monument,
                "description": "Official Department of Archaeology entrance ticket for Amber Fort and Sheesh Mahal.",
                "address": "Suraj Pol Ticket Counter, Amer",
                "latitude": 26.9855,
                "longitude": 75.8513,
                "price_info": "₹100 (Indians) / ₹500 (Foreign Nationals)",
                "price_level": "$",
                "rating": 5.0,
                "verified": True,
                "source_verified_by": admin_user,
            },
            {
                "type": ListingType.ENTRY_FEE,
                "title": "Hawa Mahal & Museum Composite Pass",
                "region": "Jaipur",
                "city": "Jaipur",
                "category": cat_monument,
                "description": "Composite entry ticket including Hawa Mahal, Jantar Mantar, and Albert Hall Museum.",
                "address": "Hawa Mahal Ticket Office, Badi Choupad",
                "latitude": 26.9239,
                "longitude": 75.8267,
                "price_info": "₹300 (Composite 2-Day Pass)",
                "price_level": "$",
                "rating": 4.9,
                "verified": True,
                "source_verified_by": admin_user,
            },
            # 4. Attractions / POIs
            {
                "type": ListingType.ATTRACTION,
                "title": "Amber Palace & Sheesh Mahal",
                "region": "Amer",
                "city": "Jaipur",
                "category": cat_monument,
                "description": "Opulent 16th-century Rajput palace renowned for mirror mosaics and royal courtyards.",
                "address": "Devisinghpura, Amer, Jaipur",
                "latitude": 26.9855,
                "longitude": 75.8513,
                "price_info": "Official Entry ₹100-₹500",
                "price_level": "$$",
                "rating": 4.9,
                "verified": True,
                "source_verified_by": admin_user,
            },
            {
                "type": ListingType.ATTRACTION,
                "title": "Hawa Mahal (Palace of Winds)",
                "region": "Jaipur",
                "city": "Jaipur",
                "category": cat_monument,
                "description": "Iconic five-story pink sandstone facade featuring 953 ornate jharokhas windows.",
                "address": "Badi Choupad, J.D.A. Market, Jaipur",
                "latitude": 26.9239,
                "longitude": 75.8267,
                "price_info": "Entry ₹50-₹200",
                "price_level": "$",
                "rating": 4.8,
                "verified": True,
                "source_verified_by": admin_user,
            },
        ]

        created_count = 0
        for item in sample_listings:
            title = item.pop("title")
            obj, created = Listing.objects.update_or_create(
                title=title,
                defaults=item,
            )
            if created:
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully seeded {created_count} sample verified listings!"
            )
        )
