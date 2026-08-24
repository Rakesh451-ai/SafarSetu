from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import SafetyZone, SafetyAlert
from accounts.models import User
from tourists.models import TouristProfile


class SafetyTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email="tourist@test.com", password="Password123")
        self.profile = TouristProfile.objects.create(user=self.user, full_name="Test Tourist")

        # Create Safe Zone in Taj perimeter
        self.safe_zone = SafetyZone.objects.create(
            name="Taj Safe Perimeter",
            zone_type="safe",
            severity="low",
            center_latitude=27.1750,
            center_longitude=78.0420,
            polygon_coordinates=[
                [27.1800, 78.0350],
                [27.1800, 78.0500],
                [27.1700, 78.0500],
                [27.1700, 78.0350],
            ],
            active_advisory="Safe & secure zone.",
            is_active=True
        )

        # Create Danger Zone in unlit riverbank
        self.danger_zone = SafetyZone.objects.create(
            name="Yamuna Danger Zone",
            zone_type="danger",
            severity="critical",
            center_latitude=27.1900,
            center_longitude=78.0450,
            polygon_coordinates=[
                [27.1950, 78.0400],
                [27.1950, 78.0500],
                [27.1850, 78.0500],
                [27.1850, 78.0400],
            ],
            active_advisory="Do not enter after dark.",
            is_active=True
        )

        # Create Safety Alert
        self.alert = SafetyAlert.objects.create(
            title="Road Diversion Advisory",
            description="Metro work diversion.",
            alert_type="caution",
            severity="medium",
            location_name="Agra Ring Road",
            latitude=27.1600,
            longitude=78.0350,
            is_active=True
        )

    def test_safety_check_inside_safe_zone(self):
        # Point inside Taj Safe Perimeter
        url = f"{reverse('safety:safety_check')}?lat=27.1750&lng=78.0420"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['status'], 'SAFE')
        self.assertEqual(response.data['data']['zone'], 'Taj Safe Perimeter')

    def test_safety_check_inside_danger_zone(self):
        # Point inside Yamuna Danger Zone
        url = f"{reverse('safety:safety_check')}?lat=27.1900&lng=78.0450"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['status'], 'DANGER')
        self.assertEqual(response.data['data']['zone'], 'Yamuna Danger Zone')

    def test_location_update_authenticated(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('safety:location_update')
        payload = {
            "latitude": 27.1750,
            "longitude": 78.0420
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['status'], 'SAFE')

        self.profile.refresh_from_db()
        self.assertEqual(self.profile.last_latitude, 27.1750)
        self.assertEqual(self.profile.safety_status, 'safe')
