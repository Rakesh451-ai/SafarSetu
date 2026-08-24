from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView
)
from config.views import health_check

urlpatterns = [
    # Django Admin Site
    path('admin/', admin.site.urls),

    # Health Check
    path('api/health/', health_check, name='health_check'),

    # OpenAPI 3 Schema & Swagger UI Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # Core SafarSetu APIs
    path('api/auth/', include('accounts.urls', namespace='accounts')),
    path('api/tourist/', include('tourists.urls', namespace='tourists')),
    path('api/destinations/', include('destinations.urls', namespace='destinations')),
    path('api/journeys/', include('journeys.urls', namespace='journeys')),
    path('api/itineraries/', include('itinerary.urls', namespace='itinerary')),
    path('api/safety/', include('safety.urls', namespace='safety')),
    path('api/emergency/', include('emergency.urls', namespace='emergency')),
    path('api/qr/', include('qr.urls', namespace='qr')),
    path('api/ai/', include('ai_assistant.urls', namespace='ai_assistant')),
    path('api/services/', include('services.urls', namespace='services')),
    path('api/notifications/', include('notifications.urls', namespace='notifications')),
    path('api/admin/', include('admin_dashboard.urls', namespace='admin_dashboard')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
