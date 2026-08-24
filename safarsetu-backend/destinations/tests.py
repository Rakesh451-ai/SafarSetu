from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import Destination, AudioGuideTrack


class DestinationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.dest_taj = Destination.objects.create(
            name="Taj Mahal",
            slug="taj-mahal",
            city="Agra",
            state="Uttar Pradesh",
            category="heritage",
            rating=4.9,
            safety_rating=4.9,
            image="https://images.unsplash.com/photo-1564507592333-c60657eea523",
            description="UNESCO world heritage marvel.",
            opening_hours="Sunrise to Sunset",
            entry_fee={"domestic": 50, "international": 1100},
            latitude=27.1751,
            longitude=78.0421,
            qr_code="SAFARSETU-POI-AGR-001"
        )
        self.dest_amber = Destination.objects.create(
            name="Amber Fort",
            slug="amber-fort",
            city="Jaipur",
            state="Rajasthan",
            category="heritage",
            rating=4.8,
            safety_rating=4.8,
            image="https://images.unsplash.com/photo-1599661046289-e31897846e41",
            description="Hilltop Rajput fort.",
            opening_hours="08:00 AM - 05:30 PM",
            latitude=26.9855,
            longitude=75.8513,
            qr_code="SAFARSETU-POI-JAI-001"
        )
        AudioGuideTrack.objects.create(
            destination=self.dest_taj,
            language="English",
            title="Architectural Tour",
            duration="14:00",
            duration_seconds=840,
            audio_url="https://example.com/audio.mp3"
        )

    def test_list_destinations(self):
        url = reverse('destinations:destination_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['count'], 2)

    def test_filter_destinations_by_city(self):
        url = f"{reverse('destinations:destination_list')}?city=Agra"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['name'], "Taj Mahal")

    def test_get_destination_detail_by_slug(self):
        url = reverse('destinations:destination_detail', kwargs={'id': 'taj-mahal'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['name'], "Taj Mahal")
        self.assertEqual(len(response.data['data']['audioGuides']), 1)

    def test_nearby_destinations_search(self):
        # Search near Agra coordinates
        url = f"{reverse('destinations:destination_nearby')}?lat=27.1700&lng=78.0400&radius=10"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertGreaterEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['destination']['slug'], 'taj-mahal')
        self.assertLess(response.data['results'][0]['distance_km'], 2.0)
