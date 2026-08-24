from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User
from tourists.models import TouristProfile


class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_user_registration_success(self):
        url = reverse('accounts:register')
        payload = {
            "name": "Rahul Verma",
            "email": "rahul.verma@traveler.in",
            "phone": "+91 91234 56789",
            "password": "Password@123",
            "preferred_language": "hi",
            "emergency_contact": {
                "name": "Sunita Verma",
                "relationship": "Mother",
                "phone": "+91 98765 00000"
            }
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertIn('access', response.data['data'])
        self.assertIn('refresh', response.data['data'])

        # Verify user & profile in database
        user = User.objects.get(email="rahul.verma@traveler.in")
        self.assertEqual(user.role, User.Role.TOURIST)
        self.assertEqual(user.preferred_language, "hi")
        profile = TouristProfile.objects.get(user=user)
        self.assertEqual(profile.full_name, "Rahul Verma")
        self.assertTrue(profile.digital_id.startswith("SS-IND"))

    def test_duplicate_registration_fails(self):
        User.objects.create_user(email="test@user.com", password="Password@123", first_name="Test")
        url = reverse('accounts:register')
        payload = {
            "name": "Another User",
            "email": "test@user.com",
            "password": "Password@123"
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])

    def test_user_login_success(self):
        user = User.objects.create_user(email="tourist@test.com", password="SecurePassword123")
        TouristProfile.objects.create(user=user, full_name="Test Tourist")

        url = reverse('accounts:login')
        payload = {
            "email": "tourist@test.com",
            "password": "SecurePassword123"
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('access', response.data['data'])

    def test_user_login_invalid_credentials(self):
        url = reverse('accounts:login')
        payload = {
            "email": "nonexistent@test.com",
            "password": "WrongPassword"
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])

    def test_me_endpoint_requires_auth(self):
        url = reverse('accounts:me')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
