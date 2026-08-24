from django.urls import path
from .views import VerifiedServiceListView, VerifiedServiceDetailView

app_name = 'services'

urlpatterns = [
    path('', VerifiedServiceListView.as_view(), name='service_list'),
    path('<str:id>/', VerifiedServiceDetailView.as_view(), name='service_detail'),
]
