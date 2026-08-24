from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="List User Notifications",
        description="Retrieve all notifications for the authenticated user, sorted by most recent.",
        responses={200: NotificationSerializer(many=True)}
    )
    def get(self, request):
        notifications = Notification.objects.filter(user=request.user)
        serializer = NotificationSerializer(notifications, many=True)
        return Response({
            "success": True,
            "count": notifications.count(),
            "unread_count": notifications.filter(is_read=False).count(),
            "results": serializer.data
        }, status=status.HTTP_200_OK)


class NotificationMarkReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Mark Notification as Read",
        description="Update read status of a notification.",
        responses={200: dict}
    )
    def patch(self, request, id):
        notif = Notification.objects.filter(id=id, user=request.user).first()
        if not notif:
            return Response({
                "success": False,
                "message": "Notification not found.",
                "errors": {"id": "Not found"}
            }, status=status.HTTP_404_NOT_FOUND)

        notif.is_read = True
        notif.save(update_fields=['is_read'])

        return Response({
            "success": True,
            "message": "Notification marked as read."
        }, status=status.HTTP_200_OK)


class NotificationMarkAllReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Mark All Notifications Read",
        description="Mark all unread notifications for current user as read.",
        responses={200: dict}
    )
    def post(self, request):
        updated_count = Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({
            "success": True,
            "message": f"Marked {updated_count} notifications as read."
        }, status=status.HTTP_200_OK)
