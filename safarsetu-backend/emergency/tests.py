from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import User
from tourists.models import TouristProfile
from emergency.models import EmergencyIncident


class EmergencySOSTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tourist_user = User.objects.create_user(
            email="aarav@tourist.in",
            password="Password123",
            first_name="Aarav",
            last_name="Sharma"
        )
        self.profile = TouristProfile.objects.create(
            user=self.tourist_user,
            full_name="Aarav Sharma",
            phone="+91 98765 43210"
        )

        self.operator_user = User.objects.create_user(
            email="operator@police.gov.in",
            password="Password123",
            role=User.Role.RESPONSE_OPERATOR,
            is_staff=True
        )

    def test_trigger_sos_creates_incident_and_updates_safety_status(self):
        self.client.force_authenticate(user=self.tourist_user)
        url = reverse('emergency:trigger_sos')
        payload = {
            "latitude": 27.1712,
            "longitude": 78.0460,
            "description": "Urgent assistance required near East Gate.",
            "emergency_type": "SOS Emergency",
            "battery_level": 75
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['status'], 'NEW')

        # Check DB
        incident = EmergencyIncident.objects.get(incident_id=response.data['incident_id'])
        self.assertEqual(incident.tourist, self.profile)
        self.assertEqual(incident.priority, 'critical')

        self.profile.refresh_from_db()
        self.assertEqual(self.profile.safety_status, 'danger')

    def test_cancel_sos(self):
        self.client.force_authenticate(user=self.tourist_user)
        incident = EmergencyIncident.objects.create(
            tourist=self.profile,
            latitude=27.1712,
            longitude=78.0460,
            status='new'
        )
        self.profile.safety_status = 'danger'
        self.profile.save()

        url = reverse('emergency:cancel_sos')
        response = self.client.post(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])

        incident.refresh_from_db()
        self.assertEqual(incident.status, 'cancelled')

        self.profile.refresh_from_db()
        self.assertEqual(self.profile.safety_status, 'safe')

    def test_operator_can_manage_incident(self):
        incident = EmergencyIncident.objects.create(
            tourist=self.profile,
            latitude=27.1712,
            longitude=78.0460,
            status='new'
        )
        self.client.force_authenticate(user=self.operator_user)
        url = reverse('emergency:emergency_incident_detail', kwargs={'id': incident.incident_id})

        # Update status to responding
        payload = {
            "status": "responding",
            "assignedOfficer": "Insp. Sharma",
            "responderNotes": "Patrol vehicle dispatched."
        }
        response = self.client.patch(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])

        incident.refresh_from_db()
        self.assertEqual(incident.status, 'responding')
        self.assertEqual(incident.assigned_officer_name, "Insp. Sharma")
