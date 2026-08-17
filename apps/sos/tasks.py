import logging
from datetime import timedelta

from celery import shared_task
from django.contrib.gis.geos import Point
from django.utils import timezone

logger = logging.getLogger("safarsetu.sos")


@shared_task(bind=True, name="apps.sos.tasks.check_missed_checkins", queue="sos")
def check_missed_checkins(self):
    """
    Celery Beat periodic task:
    Scans active CheckInSchedules for overdue tourists and auto-generates
    high-priority SOSEvents with trigger_type='missed_checkin'.
    """
    from apps.notifications.tasks import fan_out_sos_alert
    from apps.sos.models import CheckInSchedule, SOSEvent, SOSStatus, SOSTriggerType
    from apps.tracking.models import LocationPing

    now = timezone.now()
    active_schedules = CheckInSchedule.objects.filter(is_active=True).select_related(
        "tourist"
    )

    triggered_count = 0
    scanned_count = 0

    for schedule in active_schedules:
        scanned_count += 1
        if not schedule.is_overdue():
            continue

        tourist = schedule.tourist
        # Deduplication check: check if an active missed_checkin event was already created
        # within the recent interval to avoid flood
        recent_threshold = now - timedelta(
            minutes=max(schedule.expected_interval_minutes, 15)
        )
        existing_event = SOSEvent.objects.filter(
            tourist=tourist,
            trigger_type=SOSTriggerType.MISSED_CHECKIN,
            status=SOSStatus.ACTIVE,
            created_at__gte=recent_threshold,
        ).exists()

        if existing_event:
            continue

        # Get latest known location from LocationPing
        latest_ping = (
            LocationPing.objects.filter(tourist=tourist).order_by("-timestamp").first()
        )
        location_point = latest_ping.location if latest_ping else Point(0, 0, srid=4326)

        overdue_duration = int((now - schedule.last_checkin_at).total_seconds() / 60)

        # Create automated SOSEvent
        sos_event = SOSEvent.objects.create(
            tourist=tourist,
            trigger_type=SOSTriggerType.MISSED_CHECKIN,
            location=location_point,
            status=SOSStatus.ACTIVE,
            notes=(
                f"Automated Safety Alert: Tourist missed scheduled check-in window. "
                f"Expected interval: {schedule.expected_interval_minutes}m, "
                f"Overdue by: {overdue_duration}m. "
                f"Last check-in was at {schedule.last_checkin_at.strftime('%Y-%m-%d %H:%M:%S UTC')}."
            ),
        )

        logger.critical(
            "🚨 [MISSED CHECK-IN SOS CREATED] Tourist '%s' (ID: %s) is overdue by %d mins! Created SOSEvent: %s",
            tourist.name,
            tourist.tourist_id,
            overdue_duration,
            sos_event.sos_id,
        )

        # Enqueue high-priority SOS fan-out task
        try:
            fan_out_sos_alert.apply_async(
                args=[str(sos_event.sos_id)],
                queue="sos",
            )
        except Exception as e:
            logger.error(
                "Failed to enqueue fan_out_sos_alert for missed check-in: %s", e
            )

        triggered_count += 1

    return {
        "status": "success",
        "scanned": scanned_count,
        "triggered_sos_events": triggered_count,
        "timestamp": now.isoformat(),
    }
