import logging

from django.dispatch import Signal, receiver

logger = logging.getLogger("safarsetu.tracking")

# Signal triggered whenever a tourist's resolved zone status changes between pings
# Arguments: tourist, previous_status, current_status, ping, zone
zone_transition = Signal()


@receiver(zone_transition)
def handle_zone_transition(
    sender, tourist, previous_status, current_status, ping, zone=None, **kwargs
):
    """
    Handles zone transition events:
    1. Logs transition alert.
    2. Enqueues a Celery notification task on the 'default' queue to send a push/SMS alert.
    """
    from apps.notifications.tasks import send_zone_transition_notification

    zone_name = zone.name if zone else "Unclassified Region"
    logger.warning(
        "🚨 [ZONE TRANSITION DETECTED] Tourist '%s' (ID: %s) transitioned from '%s' -> '%s' "
        "at GPS (%.5f, %.5f) in Zone: '%s' at %s",
        tourist.name,
        tourist.tourist_id,
        previous_status,
        current_status,
        ping.latitude,
        ping.longitude,
        zone_name,
        ping.timestamp.isoformat(),
    )

    # Enqueue notification task on the default Celery queue
    try:
        send_zone_transition_notification.apply_async(
            kwargs={
                "tourist_id": str(tourist.tourist_id),
                "previous_status": previous_status,
                "current_status": current_status,
                "latitude": ping.latitude,
                "longitude": ping.longitude,
                "zone_name": zone_name,
            },
            queue="default",
        )
    except Exception as e:
        logger.error("Failed to enqueue zone_transition Celery task: %s", e)
