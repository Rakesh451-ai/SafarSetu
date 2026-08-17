from datetime import date, timedelta
from unittest.mock import patch

from django.contrib.auth.models import User
from django.contrib.gis.geos import Polygon
from django.test import Client, TestCase
from django.urls import reverse

from apps.assistant.models import Itinerary
from apps.guide.models import GuideProfile, TourPackage
from apps.identity.models import IDProofType, Tourist
from apps.listings.models import Listing, ListingCategory
from apps.tracking.models import Zone, ZoneType


class AssistantAndItineraryTests(TestCase):
    def setUp(self):
        self.client = Client()

        # 1. Create Tourist
        self.user = User.objects.create_user(
            username="tourist_priya_ai",
            email="priya.ai@example.com",
            password="Password123!",
            first_name="Priya",
            last_name="Sharma",
        )
        self.tourist = Tourist.objects.create(
            user=self.user,
            name="Priya Sharma",
            nationality="Indian",
            id_proof_type=IDProofType.AADHAAR,
            id_proof_number="123456789012",
            phone="+919876543210",
            preferred_language="hi",
            trip_start=date.today(),
            trip_end=date.today() + timedelta(days=5),
        )

        # 2. Seed Listing Categories and POIs
        self.cat_fort = ListingCategory.objects.create(
            name="Forts & Palaces", slug="forts-palaces"
        )
        self.cat_market = ListingCategory.objects.create(
            name="Bazaars & Crafts", slug="bazaars-crafts"
        )

        # Safe POI: Amber Fort Courtyard
        self.poi_safe = Listing.objects.create(
            category=self.cat_fort,
            title="Amber Fort & Palace",
            description="Historic 16th-century fortress and royal palace with Sheesh Mahal.",
            city="Jaipur",
            address="Devisinghpura, Amer, Jaipur",
            latitude=26.9855,
            longitude=75.8513,
            rating=4.9,
            price_level="$$",
            is_active=True,
        )

        # Caution POI: Jaigarh Fort Ridge
        self.poi_caution = Listing.objects.create(
            category=self.cat_fort,
            title="Jaigarh Fort Cannon Outpost",
            description="Military fortress housing the massive Jaivana cannon with rugged mountain trails.",
            city="Jaipur",
            address="Jaigarh Ridge, Amer",
            latitude=26.9800,
            longitude=75.8450,
            rating=4.6,
            price_level="$$",
            is_active=True,
        )

        # Danger POI: Restricted Cliffside
        self.poi_danger = Listing.objects.create(
            category=self.cat_fort,
            title="Cheel Ka Teela Cliffside Overlook",
            description="Unfenced, steep cliff edge with hazardous terrain outside safety perimeter.",
            city="Jaipur",
            address="Outer Ridge, Amer",
            latitude=26.9850,
            longitude=75.8400,
            rating=4.2,
            price_level="$",
            is_active=True,
        )

        # 3. Seed Geofence Zones (Safe, Caution, Danger)
        self.safe_zone = Zone.objects.create(
            name="Amber Fort Safe Heritage Zone",
            type=ZoneType.SAFE,
            region="Jaipur",
            boundary=Polygon(
                [
                    (75.8500, 26.9840),
                    (75.8530, 26.9840),
                    (75.8530, 26.9870),
                    (75.8500, 26.9870),
                    (75.8500, 26.9840),
                ]
            ),
        )

        self.caution_zone = Zone.objects.create(
            name="Jaigarh Fort Buffer Zone",
            type=ZoneType.CAUTION,
            region="Jaipur",
            boundary=Polygon(
                [
                    (75.8430, 26.9780),
                    (75.8470, 26.9780),
                    (75.8470, 26.9820),
                    (75.8430, 26.9820),
                    (75.8430, 26.9780),
                ]
            ),
        )

        self.danger_zone = Zone.objects.create(
            name="Cheel Ka Teela Restricted Cliffside",
            type=ZoneType.DANGER,
            region="Jaipur",
            boundary=Polygon(
                [
                    (75.8380, 26.9830),
                    (75.8420, 26.9830),
                    (75.8420, 26.9870),
                    (75.8380, 26.9870),
                    (75.8380, 26.9830),
                ]
            ),
        )

        # 4. Seed Verified Guide & Tour Package
        self.guide_user = User.objects.create_user(
            username="guide_rajesh_ai",
            email="rajesh.guide@example.com",
            first_name="Rajesh",
            last_name="Singh",
        )
        self.guide_profile = GuideProfile.objects.create(
            user=self.guide_user,
            bio="Certified Rajasthan Tourism guide with 10 years experience.",
            languages_spoken="Hindi, English, French",
            regions_served="Jaipur, Amer",
            verified=True,
            rating_avg=4.95,
            experience_years=10,
            hourly_rate=800.00,
        )
        self.package = TourPackage.objects.create(
            guide=self.guide_profile,
            title="Amer & Royal Heritage Heritage Tour",
            description="Comprehensive guided exploration of Amber Fort and royal palaces.",
            duration="1 Day",
            price=2500.00,
            max_group_size=8,
        )
        self.package.poi_refs.add(self.poi_safe)

    def test_assistant_query_rag_retrieval_and_language(self):
        """
        Tests POST /api/v1/assistant/query/:
        - Retrieves relevant POIs (e.g. Amber Fort)
        - Calls LLM in the tourist's preferred language ('hi')
        - Returns answer and source POIs
        """
        response = self.client.post(
            reverse("v1-assistant-query"),
            data={
                "tourist_id": str(self.tourist.tourist_id),
                "question": "Tell me about historic forts in Amber",
                "city": "Jaipur",
            },
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data["tourist_id"], str(self.tourist.tourist_id))
        self.assertEqual(data["language"], "hi")
        self.assertIn("answer", data)
        self.assertTrue(len(data["retrieved_pois"]) >= 1)
        poi_titles = [p["title"] for p in data["retrieved_pois"]]
        self.assertIn("Amber Fort & Palace", poi_titles)

    def test_itinerary_generation_excludes_and_flags_danger_zone_pois(self):
        """
        Tests POST /api/v1/itinerary/generate/:
        1. Evaluates candidate POIs against Geofence Zones.
        2. Strictly excludes POIs situated inside Danger Zones (Cheel Ka Teela Cliffside).
        3. Annotates Caution POIs with daylight/guide safety notices.
        4. Returns a day-by-day plan and persists as Itinerary model.
        """
        with patch.object(self.client, "post", wraps=self.client.post):
            response = self.client.post(
                reverse("v1-itinerary-generate"),
                data={
                    "tourist_id": str(self.tourist.tourist_id),
                    "destination_city": "Jaipur",
                    "duration_days": 2,
                    "interests": ["forts", "palaces", "heritage"],
                    "want_guide": True,
                },
                content_type="application/json",
            )
            self.assertEqual(response.status_code, 201)
            data = response.json()

            # 1. Verify Structure
            self.assertEqual(data["destination"], "Jaipur")
            self.assertEqual(data["duration_days"], 2)
            self.assertEqual(len(data["days"]), 2)
            self.assertIn("itinerary_id", data)

            # 2. Verify Safety Assessment & Danger Zone Exclusion
            safety_summary = data["safety_summary"]
            self.assertEqual(safety_summary["excluded_danger_destinations_count"], 1)
            excluded_titles = [
                p["title"] for p in safety_summary["excluded_destinations"]
            ]
            self.assertIn("Cheel Ka Teela Cliffside Overlook", excluded_titles)
            self.assertIn(
                "Located inside high-risk danger zone",
                safety_summary["excluded_destinations"][0]["exclusion_reason"],
            )

            # 3. Verify Day-by-Day Schedule does NOT contain the danger POI
            for day in data["days"]:
                for slot in day["schedule"]:
                    self.assertNotEqual(
                        slot.get("poi_title"),
                        "Cheel Ka Teela Cliffside Overlook",
                        "Danger zone POI was incorrectly included in active schedule!",
                    )

            # 4. Verify Suggested Guide Package
            self.assertTrue(len(data["guided_packages_suggested"]) >= 1)
            self.assertEqual(
                data["guided_packages_suggested"][0]["title"],
                "Amer & Royal Heritage Heritage Tour",
            )

            # 5. Verify Database Persistence
            itinerary_db = Itinerary.objects.get(itinerary_id=data["itinerary_id"])
            self.assertEqual(itinerary_db.duration_days, 2)
            self.assertEqual(itinerary_db.destination_city, "Jaipur")
            self.assertEqual(len(itinerary_db.day_by_day_plan), 2)
            self.assertEqual(itinerary_db.suggested_packages.count(), 1)
