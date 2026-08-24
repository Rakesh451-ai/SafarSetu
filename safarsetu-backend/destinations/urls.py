from django.urls import path
from .views import (
    DestinationListView,
    DestinationDetailView,
    NearbyDestinationsView
)

app_name = 'destinations'

urlpatterns = [
    path('', DestinationListView.as_view(), name='destination_list'),
    path('nearby/', NearbyDestinationsView.as_view(), name='destination_nearby'),
    path('<str:id>/', DestinationDetailView.as_view(), name='destination_detail'),
]
