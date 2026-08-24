from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from destinations.models import Destination


class AIAssistantTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        Destination.objects.create(
            name="Amber Fort",
            slug="amber-fort",
            city="Jaipur",
            state="Rajasthan",
            category="heritage",
            rating=4.8,
            image="https://example.com/amber.jpg",
            description="Royal hilltop fort in Jaipur.",
            opening_hours="08:00 AM - 05:30 PM",
            entry_fee={"domestic": 100, "international": 550},
            latitude=26.9855,
            longitude=75.8513,
            qr_code="SAFARSETU-POI-JAI-001"
        )

    def test_ai_chat_returns_grounded_response_and_cards(self):
        url = reverse('ai_assistant:ai_chat')
        payload = {"message": "Plan a safe 2 day trip to Jaipur"}
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('text', response.data['data'])
        self.assertIn('cards', response.data['data'])
        self.assertGreaterEqual(len(response.data['data']['cards']), 1)
