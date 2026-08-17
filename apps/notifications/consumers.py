import time

from channels.generic.websocket import AsyncJsonWebsocketConsumer


class AdminAlertConsumer(AsyncJsonWebsocketConsumer):
    """
    Real-time WebSocket consumer for administrative alerts and SOS notifications.
    Clients connecting to /ws/admin/alerts/ join the 'admin_alerts' broadcast group.
    """

    GROUP_NAME = "admin_alerts"

    async def connect(self):
        # Join admin_alerts channel layer group
        await self.channel_layer.group_add(self.GROUP_NAME, self.channel_name)
        await self.accept()

        # Send connection confirmation frame
        await self.send_json(
            {
                "type": "connection_established",
                "message": "Connected to SafarSetu Admin Alert Stream.",
                "channel": self.channel_name,
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            }
        )

    async def disconnect(self, close_code):
        # Leave admin_alerts channel layer group
        await self.channel_layer.group_discard(self.GROUP_NAME, self.channel_name)

    async def receive_json(self, content):
        """
        Echoes test message back to the sender, and handles broadcast requests.
        """
        action = content.get("action", "echo")
        payload = content.get("data", content)

        if action == "broadcast":
            # Broadcast to entire admin group
            await self.channel_layer.group_send(
                self.GROUP_NAME,
                {
                    "type": "admin_alert",
                    "payload": payload,
                    "sender": self.channel_name,
                },
            )
        else:
            # Echo back to the connected client
            await self.send_json(
                {
                    "type": "alert_echo",
                    "action": action,
                    "echo": payload,
                    "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                    "message": "Echo from SafarSetu AdminAlertConsumer",
                }
            )

    async def admin_alert(self, event):
        """
        Handler for messages pushed to the 'admin_alerts' channel layer group.
        """
        await self.send_json(
            {
                "type": "admin_alert",
                "payload": event.get("payload"),
                "sender": event.get("sender"),
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            }
        )
