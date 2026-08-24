import os
from pathlib import Path
from datetime import timedelta
import dj_database_url
from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env file
load_dotenv(BASE_DIR / '.env')

# Security settings
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-safarsetu-super-secret-key-2026-ind-heritage')
DEBUG = os.getenv('DEBUG', 'True').lower() in ('true', '1', 'yes')

allowed_hosts_raw = os.getenv('ALLOWED_HOSTS', '*')
ALLOWED_HOSTS = [host.strip() for host in allowed_hosts_raw.split(',') if host.strip()]

# Application definition
INSTALLED_APPS = [
    'daphne',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third party packages
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'drf_spectacular',
    'django_filters',
    'channels',

    # SafarSetu Core Apps
    'accounts.apps.AccountsConfig',
    'tourists.apps.TouristsConfig',
    'destinations.apps.DestinationsConfig',
    'journeys.apps.JourneysConfig',
    'itinerary.apps.ItineraryConfig',
    'safety.apps.SafetyConfig',
    'emergency.apps.EmergencyConfig',
    'qr.apps.QrConfig',
    'ai_assistant.apps.AiAssistantConfig',
    'services.apps.ServicesConfig',
    'notifications.apps.NotificationsConfig',
    'admin_dashboard.apps.AdminDashboardConfig',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'
ASGI_APPLICATION = 'config.asgi.application'

# Database Configuration
DATABASE_URL = os.getenv('DATABASE_URL')
POSTGRES_DB = os.getenv('POSTGRES_DB')

if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=600,
            conn_health_checks=True,
        )
    }
elif POSTGRES_DB:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': POSTGRES_DB,
            'USER': os.getenv('POSTGRES_USER', 'postgres'),
            'PASSWORD': os.getenv('POSTGRES_PASSWORD', ''),
            'HOST': os.getenv('POSTGRES_HOST', 'localhost'),
            'PORT': os.getenv('POSTGRES_PORT', '5432'),
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Custom User Model
AUTH_USER_MODEL = 'accounts.User'

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {'min_length': 6},
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_PAGINATION_CLASS': 'config.pagination.StandardResultsSetPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ),
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'EXCEPTION_HANDLER': 'config.exceptions.custom_exception_handler',
}

# Simple JWT Configuration
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': False,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUTH_HEADER_TYPES': ('Bearer', 'JWT'),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
}

# CORS Configuration
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Spectacular OpenAPI Documentation Settings
SPECTACULAR_SETTINGS = {
    'TITLE': 'SafarSetu Digital Tourist Guide & Safety Platform API',
    'DESCRIPTION': (
        'Comprehensive REST API for the SafarSetu platform — Digital Tourist ID, '
        'SOS Emergency Dispatch, Real-Time Geo-Safety Zones, AI Travel Assistant, '
        'Verified Heritage Monument Guides, and Smart Itineraries.'
    ),
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'COMPONENT_SPLIT_REQUEST': True,
    'TAGS': [
        {'name': 'Authentication', 'description': 'User registration, login, token refresh, and profile endpoints.'},
        {'name': 'Tourists', 'description': 'Tourist profile management and Digital Tourist ID generation.'},
        {'name': 'Destinations', 'description': 'Heritage monuments, attractions, audio guides, and nearby search.'},
        {'name': 'Journeys', 'description': 'Tourist travel tracking, milestones, and location check-ins.'},
        {'name': 'Itinerary', 'description': 'Smart day-by-day travel plans, cost estimates, and reordering.'},
        {'name': 'Safety', 'description': 'Geo-fenced safety zones, location safety evaluation, and active alerts.'},
        {'name': 'Emergency', 'description': 'SOS emergency dispatch, incident tracking, and responder management.'},
        {'name': 'QR System', 'description': 'Destination QR scanner and Digital Tourist ID verification.'},
        {'name': 'AI Assistant', 'description': 'OpenAI-powered context-aware travel copilot.'},
        {'name': 'Services', 'description': 'Verified tour guides, heritage hotels, and transport services.'},
        {'name': 'Notifications', 'description': 'Safety alerts, SOS notifications, and check-in reminders.'},
        {'name': 'Admin Dashboard', 'description': 'Triage metrics, incident resolution, and administrative analytics.'},
    ],
}

# Redis & Celery Configuration
REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
CELERY_BROKER_URL = REDIS_URL
CELERY_RESULT_BACKEND = REDIS_URL
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = TIME_ZONE

# Channels Channel Layers
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer'
    }
}

# External Services API Keys
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')
MAPBOX_ACCESS_TOKEN = os.getenv('MAPBOX_ACCESS_TOKEN', '')
FCM_SERVER_KEY = os.getenv('FCM_SERVER_KEY', '')
