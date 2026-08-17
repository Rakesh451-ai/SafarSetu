import pytest
from channels.testing import WebsocketCommunicator
from django.test import TestCase

from safarsetu.asgi import application
from safarsetu.celery import app, debug_task, sos_ping_task


class CeleryConfigurationTests(TestCase):
    def test_celery_queues_and_routing(self):
        """
        Tests Celery configuration:
        - Verify queues: 'default' and 'sos'
        - Verify default queue is 'default'
        - Verify tasks exist and run directly or via worker
        """
        queue_names = [q.name for q in app.conf.task_queues]
        self.assertIn("default", queue_names)
        self.assertIn("sos", queue_names)
        self.assertEqual(app.conf.task_default_queue, "default")

    def test_debug_task_execution(self):
        """
        Executes default queue debug task and validates output payload.
        """
        result = debug_task.apply()
        self.assertEqual(result.status, "SUCCESS")
        res_data = result.get()
        self.assertEqual(res_data["status"], "success")
        self.assertEqual(res_data["queue"], "default")
        self.assertIn("operational", res_data["message"])

    def test_sos_ping_task_execution(self):
        """
        Executes high-priority SOS queue task and validates output payload.
        """
        result = sos_ping_task.apply(args=["emergency-alert-999"])
        self.assertEqual(result.status, "SUCCESS")
        res_data = result.get()
        self.assertEqual(res_data["status"], "success")
        self.assertEqual(res_data["queue"], "sos")
        self.assertEqual(res_data["priority"], "HIGH")
        self.assertEqual(res_data["alert_id"], "emergency-alert-999")


@pytest.mark.asyncio
class WebSocketChannelsTests(TestCase):
    async def test_admin_alert_consumer_connection_and_echo(self):
        """
        Tests WebSocket client connection to /ws/admin/alerts/, verifies
        welcome frame, and tests echo response frame.
        """
        communicator = WebsocketCommunicator(application, "/ws/admin/alerts/")

        connected, subprotocol = await communicator.connect()
        self.assertTrue(
            connected, "WebSocket client failed to connect to /ws/admin/alerts/"
        )

        try:
            # 1. Verify connection established frame
            welcome_frame = await communicator.receive_json_from()
            self.assertEqual(welcome_frame["type"], "connection_established")
            self.assertIn("Connected", welcome_frame["message"])

            # 2. Send test ping message
            test_payload = {
                "action": "ping",
                "data": {"alert_level": "CRITICAL", "message": "SOS Drill Test"},
            }
            await communicator.send_json_to(test_payload)

            # 3. Receive echoed response
            echo_response = await communicator.receive_json_from()
            self.assertEqual(echo_response["type"], "alert_echo")
            self.assertEqual(echo_response["action"], "ping")
            self.assertEqual(echo_response["echo"], test_payload["data"])
            self.assertIn(
                "Echo from SafarSetu AdminAlertConsumer", echo_response["message"]
            )

        finally:
            await communicator.disconnect()
