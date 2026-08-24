from django.urls import path
from .views import (
    ItineraryListCreateView,
    ItineraryDetailView,
    ItineraryOptimizeView
)

app_name = 'itinerary'

urlpatterns = [
    path('', ItineraryListCreateView.as_view(), name='itinerary_list_create'),
    path('optimize/', ItineraryOptimizeView.as_view(), name='itinerary_optimize_general'),
    path('<int:id>/', ItineraryDetailView.as_view(), name='itinerary_detail'),
    path('<int:id>/optimize/', ItineraryOptimizeView.as_view(), name='itinerary_optimize'),
]
