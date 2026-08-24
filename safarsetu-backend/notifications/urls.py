from django.urls import path
from .views import (
    NotificationListView,
    NotificationMarkReadView,
    NotificationMarkAllReadView
)

app_name = 'notifications'

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification_list'),
    path('<int:id>/read/', NotificationMarkReadView.as_view(), name='notification_read'),
    path('mark-all-read/', NotificationMarkAllReadView.as_view(), name='notification_mark_all_read'),
]
