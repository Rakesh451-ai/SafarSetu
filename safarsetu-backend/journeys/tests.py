from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import User
from tourists.models import TouristProfile
from journeys.models import Journey


class JourneyTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email="aarav@traveler.in", password="Password123")
        self.profile = TouristProfile.objects.create(user=self.user, full_name="Aarav Sharma")
        self.client.force_authenticate(user=self.user)

    def test_create_and_list_journey(self):
        url = reverse('journeys:journey_list_create')
        payload = {
            "name": "Rajasthan Circuit",
            "currentCity": "Jaipur",
            "state": "Rajasthan",
            "status": "ACTIVE"
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])

        # List
        get_response = self.client.get(url)
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)
        self.assertEqual(get_response.data['count'], 1)

    def test_perform_check_in(self):
        journey = Journey.objects.create(tourist=self.profile, name="Golden Triangle", status="ACTIVE")
        url = reverse('journeys:journey_check_in', kwargs={'id': journey.id})
        payload = {
            "latitude": 27.1751,
            "longitude": 78.0421,
            "location_name": "Taj Mahal Checkpoint",
            "extend_minutes": 60
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])

        self.profile.refresh_from_db()
        self.assertEqual(self.profile.check_in_due_minutes, 60)
        self.assertIn("Taj Mahal Checkpoint", self.profile.last_check_in_location)
