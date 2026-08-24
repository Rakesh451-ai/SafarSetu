from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import User
from tourists.models import TouristProfile


class TouristProfileTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="tourist@safarsetu.in",
            password="Password123",
            first_name="Aarav",
            last_name="Sharma"
        )
        self.profile = TouristProfile.objects.create(
            user=self.user,
            full_name="Aarav Sharma",
            email=self.user.email,
            nationality="Indian",
            blood_group="O+ Positive"
        )
        self.client.force_authenticate(user=self.user)

    def test_get_tourist_profile(self):
        url = reverse('tourists:profile')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['name'], "Aarav Sharma")
        self.assertEqual(response.data['data']['bloodGroup'], "O+ Positive")

    def test_update_tourist_profile(self):
        url = reverse('tourists:profile')
        payload = {
            "name": "Aarav K. Sharma",
            "bloodGroup": "B+ Positive",
            "medicalNotes": "Allergic to penicillin."
        }
        response = self.client.patch(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])

        self.profile.refresh_from_db()
        self.assertEqual(self.profile.full_name, "Aarav K. Sharma")
        self.assertEqual(self.profile.blood_group, "B+ Positive")
        self.assertEqual(self.profile.medical_notes, "Allergic to penicillin.")

    def test_get_digital_tourist_id(self):
        url = reverse('tourists:digital_id')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['tourist_id'], self.profile.digital_id)
        self.assertIn("SAFARSETU-ID", response.data['data']['qr_code'])
