from datetime import date, timedelta
from unittest.mock import MagicMock

from django.contrib.auth.models import User
from django.contrib.gis.geos import Polygon
from django.test import Client, TestCase
from django.urls import reverse

from apps.identity.models import IDProofType, Tourist
from apps.tracking.models import LocationPing, Zone, ZoneType
from apps.tracking.signals import zone_transition


class TrackingAndGeofenceTests(TestCase):
    def setUp(self):
        self.client = Client()

        # 1. Create a Tourist
        self.tourist_user = User.objects.create_user(
            username="tourist_david",
            email="david@example.com",
            password="Password123!",
            first_name="David",
            last_name="Livingstone",
        )
        self.tourist = Tourist.objects.create(
            user=self.tourist_user,
            name="David Livingstone",
            nationality="British",
            id_proof_type=IDProofType.PASSPORT,
            id_proof_number="GB99887766",
            phone="+447911122233",
            preferred_language="en",
            trip_start=date.today(),
            trip_end=date.today() + timedelta(days=14),
        )

        # 2. Setup 3 Zones around Amber Fort, Jaipur
        # Safe Zone: Longitude 75.8490 to 75.8540, Latitude 26.9830 to 26.9880
        self.safe_zone = Zone.objects.create(
            name="Amber Fort Tourist Heritage Precinct",
            type=ZoneType.SAFE,
            region="Jaipur",
            boundary=Polygon(
                (
                    (75.8490, 26.9830),
                    (75.8540, 26.9830),
                    (75.8540, 26.9880),
                    (75.8490, 26.9880),
                    (75.8490, 26.9830),
                ),
                srid=4326,
            ),
            description="Main tourist enclave with security.",
        )

        # Caution Zone: Longitude 75.8440 to 75.8489, Latitude 26.9810 to 26.9890
        self.caution_zone = Zone.objects.create(
            name="Jaigarh-Amber Mountain Trail & Ridge",
            type=ZoneType.CAUTION,
            region="Jaipur",
            boundary=Polygon(
                (
                    (75.8440, 26.9810),
                    (75.8489, 26.9810),
                    (75.8489, 26.9890),
                    (75.8440, 26.9890),
                    (75.8440, 26.9810),
                ),
                srid=4326,
            ),
            description="Steep trail requiring caution.",
        )

        # Danger Zone: Longitude 75.8380 to 75.8439, Latitude 26.9800 to 26.9900
        self.danger_zone = Zone.objects.create(
            name="Cheel Ka Teela Restricted Cliffside",
            type=ZoneType.DANGER,
            region="Jaipur",
            boundary=Polygon(
                (
                    (75.8380, 26.9800),
                    (75.8439, 26.9800),
                    (75.8439, 26.9900),
                    (75.8380, 26.9900),
                    (75.8380, 26.9800),
                ),
                srid=4326,
            ),
            description="Steep cliff with vertical drop.",
        )

    def test_location_ping_in_safe_zone(self):
        """
        Transmits a GPS coordinate located inside the Safe Zone and verifies resolution.
        """
        # Coordinate inside Safe Zone (lat: 26.9855, lng: 75.8513)
        response = self.client.post(
            reverse("v1-location-ping"),
            data={
                "tourist_id": str(self.tourist.tourist_id),
                "latitude": 26.9855,
                "longitude": 75.8513,
                "accuracy_meters": 4.5,
            },
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 201)
        data = response.json()

        self.assertEqual(data["zone_status"], "safe")
        self.assertEqual(
            data["matched_zone_name"], "Amber Fort Tourist Heritage Precinct"
        )
        self.assertFalse(data["zone_transitioned"])

        # Check DB persistence
        self.assertEqual(LocationPing.objects.filter(tourist=self.tourist).count(), 1)

    def test_location_ping_danger_zone_and_transition_signal(self):
        """
        Verifies:
        1. First ping in Safe Zone (status="safe")
        2. Second ping in Danger Zone (lat: 26.9850, lng: 75.8400) resolves to "danger"
        3. Firing of zone_transition Django signal with previous='safe' and current='danger'
        """
        # 1. First ping: Safe Zone
        self.client.post(
            reverse("v1-location-ping"),
            data={
                "tourist_id": str(self.tourist.tourist_id),
                "latitude": 26.9855,
                "longitude": 75.8513,
            },
            content_type="application/json",
        )

        # Mock signal receiver to intercept the transition event
        signal_mock = MagicMock()
        zone_transition.connect(signal_mock)

        try:
            # 2. Second ping: Danger Zone (lat: 26.9850, lng: 75.8400)
            response = self.client.post(
                reverse("v1-location-ping"),
                data={
                    "tourist_id": str(self.tourist.tourist_id),
                    "latitude": 26.9850,
                    "longitude": 75.8400,
                    "accuracy_meters": 3.0,
                },
                content_type="application/json",
            )
            self.assertEqual(response.status_code, 201)
            data = response.json()

            self.assertEqual(data["zone_status"], "danger")
            self.assertEqual(data["previous_zone_status"], "safe")
            self.assertTrue(data["zone_transitioned"])
            self.assertEqual(
                data["matched_zone_name"], "Cheel Ka Teela Restricted Cliffside"
            )

            # 3. Assert signal was fired
            self.assertTrue(signal_mock.called)
            called_kwargs = signal_mock.call_args.kwargs
            self.assertEqual(called_kwargs["tourist"], self.tourist)
            self.assertEqual(called_kwargs["previous_status"], "safe")
            self.assertEqual(called_kwargs["current_status"], "danger")
            self.assertEqual(called_kwargs["zone"], self.danger_zone)

        finally:
            zone_transition.disconnect(signal_mock)

    def test_geojson_zones_endpoint(self):
        """
        Tests GET /api/v1/zones returns a valid GeoJSON FeatureCollection.
        """
        response = self.client.get(reverse("v1-zones"))
        self.assertEqual(response.status_code, 200)

        geojson = response.json()
        self.assertEqual(geojson["type"], "FeatureCollection")
        self.assertIn("features", geojson)
        self.assertEqual(len(geojson["features"]), 3)

        first_feature = geojson["features"][0]
        self.assertEqual(first_feature["type"], "Feature")
        self.assertEqual(first_feature["geometry"]["type"], "Polygon")
        self.assertIn("properties", first_feature)
        self.assertIn("zone_id", first_feature["properties"])
        self.assertIn("name", first_feature["properties"])
        self.assertIn("type", first_feature["properties"])
        self.assertIn("region", first_feature["properties"])

    def test_geojson_zones_bbox_filtering(self):
        """
        Tests GET /api/v1/zones?bbox=min_lon,min_lat,max_lon,max_lat filters correctly.
        """
        # Bounding box around only the Safe Zone area
        bbox_safe = "75.8480,26.9820,75.8550,26.9890"
        resp_safe = self.client.get(f"{reverse('v1-zones')}?bbox={bbox_safe}")
        self.assertEqual(resp_safe.status_code, 200)
        features = resp_safe.json()["features"]
        zone_names = [f["properties"]["name"] for f in features]

        self.assertIn("Amber Fort Tourist Heritage Precinct", zone_names)
        self.assertNotIn("Cheel Ka Teela Restricted Cliffside", zone_names)

        # Bounding box completely outside Jaipur
        bbox_outside = "72.0,20.0,73.0,21.0"
        resp_outside = self.client.get(f"{reverse('v1-zones')}?bbox={bbox_outside}")
        self.assertEqual(resp_outside.status_code, 200)
        self.assertEqual(len(resp_outside.json()["features"]), 0)
