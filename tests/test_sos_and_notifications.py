from datetime import date, timedelta
from unittest.mock import patch

import pytest
from channels.testing import WebsocketCommunicator
from django.contrib.auth.models import User
from django.contrib.gis.geos import Point
from django.test import Client, TestCase
from django.urls import reverse
from django.utils import timezone

from apps.identity.models import EmergencyContact, IDProofType, Tourist
from apps.notifications.tasks import (
    fan_out_sos_alert,
    send_zone_transition_notification,
)
from apps.sos.models import CheckInSchedule, SOSEvent, SOSStatus, SOSTriggerType
from apps.sos.tasks import check_missed_checkins
from safarsetu.asgi import application


class SOSAndNotificationTests(TestCase):
    def setUp(self):
        self.client = Client()

        # 1. Create a Tourist
        self.user = User.objects.create_user(
            username="tourist_priya",
            email="priya@example.com",
            password="Password123!",
            first_name="Priya",
            last_name="Sharma",
        )
        self.tourist = Tourist.objects.create(
            user=self.user,
            name="Priya Sharma",
            nationality="Indian",
            id_proof_type=IDProofType.AADHAAR,
            id_proof_number="987654321098",
            phone="+919876543210",
            preferred_language="hi",
            trip_start=date.today(),
            trip_end=date.today() + timedelta(days=7),
        )

        # 2. Add Emergency Contacts
        self.contact1 = EmergencyContact.objects.create(
            tourist=self.tourist,
            name="Ramesh Sharma",
            phone="+919811100011",
            relation="Father",
        )
        self.contact2 = EmergencyContact.objects.create(
            tourist=self.tourist,
            name="Sunita Sharma",
            phone="+919811100022",
            relation="Mother",
        )

    def test_sos_post_endpoint_synchronous_write_and_celery_enqueue(self):
        """
        Tests:
        1. POST /api/v1/sos/ creates SOSEvent synchronously.
        2. Celery task fan_out_sos_alert is enqueued with queue='sos'.
        """
        with patch(
            "apps.notifications.tasks.fan_out_sos_alert.apply_async"
        ) as mock_apply_async:
            response = self.client.post(
                reverse("v1-sos-trigger"),
                data={
                    "tourist_id": str(self.tourist.tourist_id),
                    "latitude": 26.9855,
                    "longitude": 75.8513,
                    "trigger_type": "manual",
                    "notes": "Feeling unsafe near isolated trail.",
                },
                content_type="application/json",
            )
            self.assertEqual(response.status_code, 201)
            data = response.json()

            self.assertEqual(data["status"], "active")
            self.assertEqual(data["trigger_type"], "manual")
            self.assertEqual(data["tourist_id"], str(self.tourist.tourist_id))
            self.assertEqual(data["latitude"], 26.9855)
            self.assertEqual(data["longitude"], 75.8513)

            # Assert SOSEvent saved in DB
            sos_obj = SOSEvent.objects.get(sos_id=data["sos_id"])
            self.assertEqual(sos_obj.status, SOSStatus.ACTIVE)

            # Assert Celery task enqueued on 'sos' queue
            self.assertTrue(mock_apply_async.called)
            called_kwargs = mock_apply_async.call_args.kwargs
            self.assertEqual(called_kwargs["queue"], "sos")
            self.assertEqual(
                mock_apply_async.call_args.kwargs["args"], [str(sos_obj.sos_id)]
            )

    def test_fan_out_sos_alert_task_execution(self):
        """
        Executes fan_out_sos_alert directly and verifies:
        - Emergency contacts are fetched and mock SMS notifications are sent.
        - Returns success summary.
        """
        sos_event = SOSEvent.objects.create(
            tourist=self.tourist,
            trigger_type=SOSTriggerType.MANUAL,
            location=Point(75.8513, 26.9855, srid=4326),
            status=SOSStatus.ACTIVE,
            notes="Medical assistance needed.",
        )

        result = fan_out_sos_alert.apply(args=[str(sos_event.sos_id)])
        self.assertEqual(result.status, "SUCCESS")
        res_data = result.get()

        self.assertEqual(res_data["status"], "success")
        self.assertEqual(res_data["contacts_notified"], 2)
        self.assertTrue(res_data["websocket_broadcast"])

    def test_missed_checkin_periodic_task(self):
        """
        Tests Celery beat scanner:
        - Sets up an overdue CheckInSchedule (last check-in 120 mins ago with 60 min interval)
        - Runs check_missed_checkins()
        - Asserts automated SOSEvent is created with trigger_type='missed_checkin'
        """
        # Create overdue schedule
        two_hours_ago = timezone.now() - timedelta(minutes=120)
        schedule = CheckInSchedule.objects.create(
            tourist=self.tourist,
            expected_interval_minutes=60,
            last_checkin_at=two_hours_ago,
            is_active=True,
        )
        self.assertTrue(schedule.is_overdue())

        with patch(
            "apps.notifications.tasks.fan_out_sos_alert.apply_async"
        ) as mock_fanout:
            result = check_missed_checkins.apply()
            self.assertEqual(result.status, "SUCCESS")
            res_data = result.get()

            self.assertEqual(res_data["status"], "success")
            self.assertEqual(res_data["triggered_sos_events"], 1)

            # Verify automated SOSEvent in database
            missed_event = SOSEvent.objects.filter(
                tourist=self.tourist,
                trigger_type=SOSTriggerType.MISSED_CHECKIN,
            ).first()
            self.assertIsNotNone(missed_event)
            self.assertEqual(missed_event.status, SOSStatus.ACTIVE)
            self.assertIn("Automated Safety Alert", missed_event.notes)

            # Verify fan_out task enqueued on 'sos' queue
            self.assertTrue(mock_fanout.called)
            self.assertEqual(mock_fanout.call_args.kwargs["queue"], "sos")

    def test_checkin_schedule_and_checkin_action_endpoints(self):
        """
        Tests:
        1. POST /api/v1/checkin/schedule/ sets expected_interval_minutes.
        2. POST /api/v1/checkin/ resets last_checkin_at.
        """
        # 1. Setup schedule
        sched_resp = self.client.post(
            reverse("v1-checkin-schedule"),
            data={
                "tourist_id": str(self.tourist.tourist_id),
                "expected_interval_minutes": 45,
                "is_active": True,
            },
            content_type="application/json",
        )
        self.assertEqual(sched_resp.status_code, 201)
        self.assertEqual(sched_resp.json()["expected_interval_minutes"], 45)

        # 2. Simulate time passing and check in
        schedule = CheckInSchedule.objects.get(tourist=self.tourist)
        schedule.last_checkin_at = timezone.now() - timedelta(minutes=50)
        schedule.save()
        self.assertTrue(schedule.is_overdue())

        checkin_resp = self.client.post(
            reverse("v1-checkin-action"),
            data={
                "tourist_id": str(self.tourist.tourist_id),
                "latitude": 26.9855,
                "longitude": 75.8513,
            },
            content_type="application/json",
        )
        self.assertEqual(checkin_resp.status_code, 200)

        schedule.refresh_from_db()
        self.assertFalse(schedule.is_overdue())

    def test_zone_transition_notification_task_execution(self):
        """
        Tests send_zone_transition_notification task.
        """
        result = send_zone_transition_notification.apply(
            kwargs={
                "tourist_id": str(self.tourist.tourist_id),
                "previous_status": "safe",
                "current_status": "danger",
                "latitude": 26.9850,
                "longitude": 75.8400,
                "zone_name": "Cheel Ka Teela Cliffside",
            }
        )
        self.assertEqual(result.status, "SUCCESS")
        self.assertEqual(result.get()["current_status"], "danger")


@pytest.mark.asyncio
class SOSEndToEndWebSocketTests(TestCase):
    async def test_end_to_end_sos_broadcast_to_websocket_client(self):
        """
        End-to-End Test:
        1. Connect test WebSocket client to /ws/admin/alerts/.
        2. Create and trigger an SOS event via fan_out_sos_alert.
        3. Confirm the connected WebSocket client receives the live SOS broadcast frame!
        """
        from channels.db import database_sync_to_async

        @database_sync_to_async
        def create_test_data_and_trigger_sos():
            tourist_user = User.objects.create(
                username="ws_tourist_alex",
                email="alex@example.com",
                first_name="Alex",
                last_name="Mercer",
            )
            tourist = Tourist.objects.create(
                user=tourist_user,
                name="Alex Mercer",
                nationality="American",
                id_proof_type=IDProofType.PASSPORT,
                id_proof_number="USA987123",
                phone="+14155552671",
                preferred_language="en",
                trip_start=date.today(),
                trip_end=date.today() + timedelta(days=5),
            )
            EmergencyContact.objects.create(
                tourist=tourist,
                name="Dana Mercer",
                phone="+14155559988",
                relation="Sister",
            )
            sos_event = SOSEvent.objects.create(
                tourist=tourist,
                trigger_type=SOSTriggerType.MANUAL,
                location=Point(75.8513, 26.9855, srid=4326),
                status=SOSStatus.ACTIVE,
                notes="Immediate evacuation needed.",
            )
            # Run task
            res = fan_out_sos_alert.apply(args=[str(sos_event.sos_id)]).get()
            return str(sos_event.sos_id), res

        communicator = WebsocketCommunicator(application, "/ws/admin/alerts/")
        connected, _ = await communicator.connect()
        self.assertTrue(
            connected, "WebSocket client failed to connect to /ws/admin/alerts/"
        )

        try:
            # 1. Consume connection established frame
            welcome_frame = await communicator.receive_json_from()
            self.assertEqual(welcome_frame["type"], "connection_established")

            # 2. Trigger SOS and run fan-out in sync db context
            sos_id, res = await create_test_data_and_trigger_sos()
            self.assertEqual(res["status"], "success")

            # 3. Assert WebSocket received the real-time SOS broadcast frame
            broadcast_msg = await communicator.receive_json_from()

            self.assertEqual(broadcast_msg["type"], "admin_alert")
            payload = broadcast_msg["payload"]
            self.assertEqual(payload["event"], "SOS_EMERGENCY_TRIGGERED")
            self.assertEqual(payload["sos_id"], sos_id)
            self.assertEqual(payload["tourist_name"], "Alex Mercer")
            self.assertEqual(payload["tourist_phone"], "+14155552671")
            self.assertEqual(payload["latitude"], 26.9855)
            self.assertEqual(payload["longitude"], 75.8513)
            self.assertEqual(payload["emergency_contacts_count"], 1)
            self.assertEqual(payload["emergency_contacts"][0]["name"], "Dana Mercer")

        finally:
            await communicator.disconnect()
