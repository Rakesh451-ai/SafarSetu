from datetime import date, timedelta

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.identity.models import IDProofType, Tourist
from apps.identity.qr_service import generate_signed_jwt_payload
from apps.poi.models import (
    POI,
    AccommodationOption,
    AccommodationType,
    TransportMode,
    TransportOption,
)


class POIAndTourBriefTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create Famous POI: Amber Fort
        self.amber_fort = POI.objects.create(
            name="Amber Fort & Palace",
            category="Heritage Fort",
            region="Amer",
            city="Jaipur",
            description="Hilltop palace fortress in Amer.",
            history="Constructed in 1592 by Raja Man Singh.",
            facilities=["Audio Guide", "EV Shuttle", "Medical Kiosk"],
            latitude=26.985500,
            longitude=75.851300,
            entry_fee_info="₹100 (Indian) • ₹500 (Foreign)",
            best_time_to_visit="8:00 AM – 11:00 AM",
            avg_visit_duration_minutes=150,
            is_hidden_gem=False,
            entry_gate_qr_id="GATE-AMER-FORT-01",
            short_video_url="https://assets.mixkit.co/preview/amber.mp4",
            images=["https://images.unsplash.com/photo-1.jpg"],
            rating=4.90,
            is_active=True,
        )

        # Create Transport and Accommodation for Amber Fort
        TransportOption.objects.create(
            poi=self.amber_fort,
            mode=TransportMode.TAXI,
            from_landmark="Jaipur Junction Railway Station",
            estimated_price_range="₹350 – ₹450",
            estimated_duration="30 mins",
            verified=True,
        )
        AccommodationOption.objects.create(
            poi=self.amber_fort,
            name="Amer Heritage Haveli",
            type=AccommodationType.HOTEL,
            price_range="₹3,200 / night",
            distance_from_poi="450m from gate",
            rating=4.85,
            verified=True,
        )

        # Create Nearby Hidden Gem POI: Panna Meena Stepwell (1.2 km away)
        self.stepwell = POI.objects.create(
            name="Panna Meena Ka Kund",
            category="Historic Stepwell",
            region="Amer",
            city="Jaipur",
            description="Geometric 16th century stepwell.",
            history="Ancient community rainwater harvesting stepwell.",
            facilities=["Archaeological Guard"],
            latitude=26.988200,
            longitude=75.856900,
            entry_fee_info="Free Entry",
            best_time_to_visit="7:30 AM – 9:30 AM",
            avg_visit_duration_minutes=45,
            is_hidden_gem=True,
            entry_gate_qr_id="GATE-PANNA-MEENA-06",
            images=["https://images.unsplash.com/stepwell.jpg"],
            rating=4.92,
            is_active=True,
        )

        # Create Far Hidden Gem (Udaipur ~390 km away, should not be included in Amber Fort nearby)
        self.far_gem = POI.objects.create(
            name="Ahar Royal Cenotaphs (Udaipur)",
            category="Royal Cenotaphs",
            region="Udaipur",
            city="Udaipur",
            latitude=24.585400,
            longitude=73.712500,
            is_hidden_gem=True,
            entry_gate_qr_id="GATE-AHAR-UDAIPUR-99",
            is_active=True,
        )

        # Create Sample Tourist and valid signed token
        self.tourist = Tourist.objects.create(
            name="Alex Mercer",
            nationality="American",
            id_proof_type=IDProofType.PASSPORT,
            id_proof_number="US998877",
            phone="+14155552671",
            preferred_language="en",
            trip_start=date.today(),
            trip_end=date.today() + timedelta(days=5),
        )
        self.signed_tourist_jwt, _, _, _ = generate_signed_jwt_payload(self.tourist)

    def test_featured_pois_endpoint_returns_only_famous_landmarks(self):
        """GET /api/v1/poi/featured returns is_hidden_gem=False POIs with video preview URLs."""
        url = "/api/v1/poi/featured"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()
        results = data.get("results", data)
        self.assertTrue(len(results) >= 1)

        # Verify no hidden gems are in the featured list
        for item in results:
            self.assertFalse(item["is_hidden_gem"])
            self.assertIn("short_video_url", item)

    def test_poi_detail_endpoint_returns_transports_and_stays(self):
        """GET /api/v1/poi/<uuid:pk> returns complete detail bundle."""
        url = f"/api/v1/poi/{self.amber_fort.poi_id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()
        self.assertEqual(data["name"], "Amber Fort & Palace")
        self.assertTrue(len(data["transport_options"]) >= 1)
        self.assertTrue(len(data["accommodation_options"]) >= 1)

    def test_tour_brief_service_and_endpoint(self):
        """POST /api/v1/tour-brief returns structured tour brief with nearby hidden gems."""
        url = "/api/v1/tour-brief"
        payload = {"poi_id": str(self.amber_fort.poi_id)}
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()
        self.assertIn("overview", data)
        self.assertIn("how_to_get_there", data)
        self.assertIn("where_to_stay", data)
        self.assertIn("price_transparency", data)
        self.assertIn("suggested_hidden_gems", data)

        # Ensure nearby hidden gem (Panna Meena Kund) is in suggestions, but far gem (Udaipur) is not
        gem_names = [g["name"] for g in data["suggested_hidden_gems"]]
        self.assertIn("Panna Meena Ka Kund", gem_names)
        self.assertNotIn("Ahar Royal Cenotaphs (Udaipur)", gem_names)

    def test_unified_scan_entry_gate_qr_returns_full_poi_brief(self):
        """POST /api/v1/scan with physical monument gate QR returns POI detail bundle."""
        url = "/api/v1/scan"
        payload = {"qr_payload": "GATE-AMER-FORT-01"}
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()
        self.assertEqual(data["scan_type"], "ENTRY_GATE_POI")
        self.assertEqual(data["status"], "VALID_GATE_QR")
        self.assertIn("poi_brief", data)
        self.assertEqual(data["poi_brief"]["name"], "Amber Fort & Palace")

    def test_unified_scan_tourist_jwt_returns_tourist_validation(self):
        """POST /api/v1/scan with Tourist Digital ID token validates cryptographic pass."""
        url = "/api/v1/scan"
        payload = {"qr_payload": self.signed_tourist_jwt}
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()
        self.assertEqual(data["scan_type"], "TOURIST_DIGITAL_ID")
        self.assertEqual(data["status"], "VALID_TOURIST_PASS")
        self.assertEqual(data["tourist_data"]["name"], "Alex Mercer")

    def test_unified_scan_invalid_payload_returns_400(self):
        """POST /api/v1/scan with bogus payload returns 400 Bad Request."""
        url = "/api/v1/scan"
        payload = {"qr_payload": "INVALID_CORRUPTED_CODE_9999"}
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()["status"], "INVALID_QR")
