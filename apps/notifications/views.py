from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions

from .models import Notification
from .serializers import NotificationSerializer


@extend_schema(
    tags=["Notifications"], summary="List user notifications or send an alert"
)
class NotificationListCreateView(generics.ListCreateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

    def perform_create(self, serializer):
        serializer.save(recipient=self.request.user)


@extend_schema(tags=["Notifications"], summary="Retrieve and mark notification as read")
class NotificationDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)
