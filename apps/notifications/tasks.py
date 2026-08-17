import logging

from asgiref.sync import async_to_sync
from celery import shared_task
from channels.layers import get_channel_layer

from apps.identity.models import EmergencyContact, Tourist

logger = logging.getLogger("safarsetu.notifications")


@shared_task(bind=True, name="apps.notifications.tasks.fan_out_sos_alert", queue="sos")
def fan_out_sos_alert(self, sos_id: str):
    """
    High-priority Celery task executed on the 'sos' queue:
    1. Fetches the SOSEvent.
    2. Sends emergency SMS notifications to all registered emergency contacts (mock gateway).
    3. Broadcasts a real-time SOS alert payload to the 'admin_alerts' WebSocket channel group.
    """
    from apps.sos.models import SOSEvent

    try:
        sos_event = SOSEvent.objects.select_related("tourist").get(sos_id=sos_id)
    except SOSEvent.DoesNotExist:
        logger.error("SOSEvent with ID %s not found for fan-out dispatch.", sos_id)
        return {"status": "error", "message": f"SOSEvent {sos_id} not found."}

    tourist = sos_event.tourist
    contacts = list(EmergencyContact.objects.filter(tourist=tourist))

    # 1. Stub SMS Gateway Dispatch to Emergency Contacts
    dispatched_contacts = []
    for contact in contacts:
        msg = (
            f"🚨 SAFARSETU EMERGENCY ALERT! 🚨\n"
            f"Tourist: {tourist.name} (Phone: {tourist.phone})\n"
            f"Trigger: {sos_event.get_trigger_type_display()}\n"
            f"Location: ({sos_event.latitude:.5f}, {sos_event.longitude:.5f})\n"
            f"Time: {sos_event.created_at.strftime('%Y-%m-%d %H:%M:%S UTC')}\n"
            f"Distress Notes: {sos_event.notes or 'None'}"
        )
        logger.critical(
            "📱 [SMS GATEWAY DISPATCH] To: %s (%s) | Relation: %s | Message:\n%s",
            contact.name,
            contact.phone,
            contact.relation,
            msg,
        )
        dispatched_contacts.append(
            {"name": contact.name, "phone": contact.phone, "relation": contact.relation}
        )

    # 2. Push Real-time Broadcast Frame to WebSocket Admin Clients
    channel_layer = get_channel_layer()
    alert_payload = {
        "event": "SOS_EMERGENCY_TRIGGERED",
        "sos_id": str(sos_event.sos_id),
        "tourist_id": str(tourist.tourist_id),
        "tourist_name": tourist.name,
        "tourist_phone": tourist.phone,
        "trigger_type": sos_event.trigger_type,
        "trigger_display": sos_event.get_trigger_type_display(),
        "status": sos_event.status,
        "latitude": sos_event.latitude,
        "longitude": sos_event.longitude,
        "notes": sos_event.notes,
        "emergency_contacts_count": len(dispatched_contacts),
        "emergency_contacts": dispatched_contacts,
        "timestamp": sos_event.created_at.isoformat(),
    }

    if channel_layer:
        try:
            async_to_sync(channel_layer.group_send)(
                "admin_alerts",
                {
                    "type": "admin_alert",
                    "payload": alert_payload,
                    "sender": "sos_fanout_system",
                },
            )
            logger.info(
                "📡 Pushed SOS alert %s to 'admin_alerts' WebSocket group.", sos_id
            )
        except Exception as e:
            logger.error(
                "Failed to broadcast SOS alert %s to WebSocket group: %s", sos_id, e
            )

    return {
        "status": "success",
        "sos_id": str(sos_event.sos_id),
        "contacts_notified": len(dispatched_contacts),
        "websocket_broadcast": True,
    }


@shared_task(
    bind=True,
    name="apps.notifications.tasks.send_zone_transition_notification",
    queue="default",
)
def send_zone_transition_notification(
    self,
    tourist_id: str,
    previous_status: str,
    current_status: str,
    latitude: float,
    longitude: float,
    zone_name: str = None,
):
    """
    Default-queue Celery task triggered by the zone_transition signal.
    Sends push/SMS-stub alerts to the tourist regarding safety boundary changes.
    """
    try:
        tourist = Tourist.objects.get(tourist_id=tourist_id)
    except Tourist.DoesNotExist:
        logger.error("Tourist %s not found for zone notification.", tourist_id)
        return {"status": "error", "message": "Tourist not found."}

    zone_label = f"'{zone_name}'" if zone_name else "an unclassified area"
    if current_status == "danger":
        alert_msg = (
            f"⚠️ DANGER ZONE WARNING: You have entered a high-risk zone ({zone_label}) "
            f"at ({latitude:.5f}, {longitude:.5f}). Please stay on marked trails or return to safety."
        )
    elif current_status == "caution":
        alert_msg = (
            f"🟡 CAUTION NOTICE: You have entered a caution zone ({zone_label}) "
            f"at ({latitude:.5f}, {longitude:.5f}). Please exercise vigilance."
        )
    else:
        alert_msg = (
            f"🟢 SAFE ZONE: You are now in a verified safe tourist zone ({zone_label})."
        )

    logger.warning(
        "📲 [PUSH/SMS GATEWAY] Tourist '%s' (%s):\n%s",
        tourist.name,
        tourist.phone,
        alert_msg,
    )

    return {
        "status": "success",
        "tourist_id": str(tourist.tourist_id),
        "previous_status": previous_status,
        "current_status": current_status,
        "message": alert_msg,
    }
