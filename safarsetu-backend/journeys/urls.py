from django.urls import path
from .views import (
    JourneyListCreateView,
    JourneyDetailView,
    JourneyCheckInView
)

app_name = 'journeys'

urlpatterns = [
    path('', JourneyListCreateView.as_view(), name='journey_list_create'),
    path('check-in/', JourneyCheckInView.as_view(), name='journey_check_in_general'),
    path('<int:id>/', JourneyDetailView.as_view(), name='journey_detail'),
    path('<int:id>/check-in/', JourneyCheckInView.as_view(), name='journey_check_in'),
]
