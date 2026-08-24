from celery import shared_task
from django.utils import timezone
from .models import SafetyAlert


@shared_task
def cleanup_expired_alerts_task():
    """Deactivates safety alerts that have passed their expires_at date."""
    now = timezone.now()
    count = SafetyAlert.objects.filter(is_active=True, expires_at__lte=now).update(is_active=False)
    return f"Deactivated {count} expired safety alerts."
