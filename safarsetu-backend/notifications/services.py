import logging
from typing import Optional, Dict, Any, List
from django.conf import settings
from .models import Notification
from accounts.models import User

logger = logging.getLogger(__name__)


class NotificationService:
    """
    Notification delivery abstraction layer.
    Handles in-app database notifications, FCM Push, SMS notifications, and Email alerts.
    """

    @staticmethod
    def send(
        user: User,
        title: str,
        message: str,
        notification_type: str = 'SYSTEM',
        metadata: Optional[Dict[str, Any]] = None
    ) -> Notification:
        """Create and dispatch a notification."""
        notif = Notification.objects.create(
            user=user,
            title=title,
            message=message,
            notification_type=notification_type,
            metadata=metadata or {}
        )
        logger.info(f"Notification [{notification_type}] dispatched to user {user.email}: {title}")

        # Stub for external FCM Push Notification (if configured)
        if getattr(settings, 'FCM_SERVER_KEY', None):
            try:
                # FCM integration hook
                pass
            except Exception as e:
                logger.error(f"FCM Push failed: {e}")

        return notif

    @staticmethod
    def broadcast_to_role(
        role: str,
        title: str,
        message: str,
        notification_type: str = 'SYSTEM',
        metadata: Optional[Dict[str, Any]] = None
    ) -> List[Notification]:
        """Broadcast an alert to all users with a specific role (e.g. ADMIN or RESPONSE_OPERATOR)."""
        users = User.objects.filter(role=role, is_active=True)
        notifications = []
        for user in users:
            notifications.append(
                Notification(
                    user=user,
                    title=title,
                    message=message,
                    notification_type=notification_type,
                    metadata=metadata or {}
                )
            )
        return Notification.objects.bulk_create(notifications)
