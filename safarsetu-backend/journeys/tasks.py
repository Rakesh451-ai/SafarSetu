from celery import shared_task
from django.utils import timezone
from .models import Journey, CheckInSchedule
from tourists.models import TouristProfile
from notifications.models import Notification


@shared_task
def check_missed_checkins_task():
    """
    Scheduled task checking for tourists who missed their check-in deadlines.
    Sends notifications to emergency contacts and triggers safety caution status.
    """
    now = timezone.now()
    # Find pending check-in schedules that have expired
    overdue_schedules = CheckInSchedule.objects.filter(
        status='PENDING',
        expected_check_in_time__lt=now
    ).select_related('tourist', 'journey')

    escalated_count = 0
    for schedule in overdue_schedules:
        schedule.status = 'MISSED'
        schedule.save(update_fields=['status'])

        tourist = schedule.tourist
        tourist.safety_status = 'caution'
        tourist.save(update_fields=['safety_status'])

        # Create system notification for tourist and emergency logs
        if tourist.user:
            Notification.objects.create(
                user=tourist.user,
                title='⚠️ Check-in Deadline Missed',
                message=f"You missed your scheduled check-in for {schedule.journey.name}. Please confirm your safety.",
                notification_type='CHECK_IN'
            )

        escalated_count += 1

    return f"Checked missed check-ins: {escalated_count} schedules marked as missed."
