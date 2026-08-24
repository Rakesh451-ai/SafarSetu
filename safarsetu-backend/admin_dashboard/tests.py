from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import User
from tourists.models import TouristProfile
from safety.models import SafetyZone, SafetyAlert
from emergency.models import EmergencyIncident


class AdminDashboardTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            email="admin@safarsetu.gov.in",
            password="AdminPassword",
            role=User.Role.ADMIN,
            is_staff=True
        )
        self.tourist_user = User.objects.create_user(
            email="tourist@test.com",
            password="Password123",
            role=User.Role.TOURIST
        )
        self.profile = TouristProfile.objects.create(user=self.tourist_user, full_name="Tourist User")

        EmergencyIncident.objects.create(
            tourist=self.profile,
            latitude=27.1712,
            longitude=78.0460,
            status='new'
        )

    def test_admin_dashboard_stats_endpoint(self):
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('admin_dashboard:admin_dashboard_stats')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('activeTourists', response.data['data'])
        self.assertIn('openSOS', response.data['data'])
        self.assertIn('touristFlowData', response.data['data'])

    def test_tourist_cannot_access_admin_dashboard(self):
        self.client.force_authenticate(user=self.tourist_user)
        url = reverse('admin_dashboard:admin_dashboard_stats')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
