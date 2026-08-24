from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from destinations.models import Destination
from accounts.models import User
from tourists.models import TouristProfile


class QRScanTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.dest = Destination.objects.create(
            name="Taj Mahal",
            slug="taj-mahal",
            city="Agra",
            state="Uttar Pradesh",
            category="heritage",
            rating=4.9,
            image="https://images.unsplash.com/photo-1564507592333-c60657eea523",
            description="UNESCO monument.",
            opening_hours="Sunrise to Sunset",
            latitude=27.1751,
            longitude=78.0421,
            qr_code="SAFARSETU-POI-AGR-001"
        )
        self.user = User.objects.create_user(email="test@traveler.in", password="Password123")
        self.profile = TouristProfile.objects.create(
            user=self.user,
            full_name="Aarav Sharma",
            digital_id="SS-IND-2026-8849"
        )

    def test_scan_destination_qr(self):
        url = reverse('qr:qr_scan')
        payload = {"qr_code": "SAFARSETU-POI-AGR-001"}
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['destination']['name'], "Taj Mahal")

    def test_scan_destination_by_slug(self):
        url = reverse('qr:qr_scan')
        payload = {"qr_code": "taj-mahal"}
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])

    def test_public_digital_tourist_id_verification(self):
        url = reverse('qr:qr_verify_tourist', kwargs={'tourist_id': 'SS-IND-2026-8849'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['name'], "Aarav Sharma")
        self.assertEqual(response.data['data']['tourist_id'], "SS-IND-2026-8849")
