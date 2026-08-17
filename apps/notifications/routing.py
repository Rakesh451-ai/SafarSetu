from django.urls import re_path

from .consumers import AdminAlertConsumer

websocket_urlpatterns = [
    re_path(r"^ws/admin/alerts/?$", AdminAlertConsumer.as_asgi()),
]
