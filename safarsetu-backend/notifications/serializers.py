from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    timeAgo = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ('id', 'title', 'message', 'notification_type', 'is_read', 'metadata', 'created_at', 'timeAgo')

    def get_timeAgo(self, obj):
        return obj.created_at.strftime('%b %d, %I:%M %p') if obj.created_at else 'Recently'
