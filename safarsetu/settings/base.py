import glob
import sys
from datetime import timedelta
from pathlib import Path

import environ

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent
APPS_DIR = BASE_DIR / "apps"

# Add apps directory to sys.path
sys.path.insert(0, str(APPS_DIR))

# Initialize django-environ
env = environ.Env(
    DJANGO_DEBUG=(bool, False),
    DJANGO_SECRET_KEY=(str, "django-insecure-default-change-in-production-key"),
    DJANGO_ALLOWED_HOSTS=(list, ["127.0.0.1", "localhost"]),
    CORS_ALLOW_ALL_ORIGINS=(bool, False),
    CORS_ALLOWED_ORIGINS=(list, []),
)

# Read .env file if present
env_file = BASE_DIR / ".env"
if env_file.exists():
    env.read_env(str(env_file))

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env("DJANGO_SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env("DJANGO_DEBUG")

ALLOWED_HOSTS = env("DJANGO_ALLOWED_HOSTS")

# GeoDjango GIS Library Discovery
GDAL_LIBRARY_PATH = env.str("GDAL_LIBRARY_PATH", default="")
GEOS_LIBRARY_PATH = env.str("GEOS_LIBRARY_PATH", default="")

if not GDAL_LIBRARY_PATH:
    found_gdal = glob.glob(
        str(BASE_DIR / ".venv/lib/python*/site-packages/rasterio.libs/libgdal*.so*")
    )
    if found_gdal:
        GDAL_LIBRARY_PATH = found_gdal[0]

if not GEOS_LIBRARY_PATH:
    found_geos = glob.glob(
        str(BASE_DIR / ".venv/lib/python*/site-packages/rasterio.libs/libgeos_c*.so*")
    ) or glob.glob(
        str(BASE_DIR / ".venv/lib/python*/site-packages/shapely.libs/libgeos_c*.so*")
    )
    if found_geos:
        GEOS_LIBRARY_PATH = found_geos[0]

# Proj database discovery for coordinate transformations
proj_data_paths = glob.glob(
    str(BASE_DIR / ".venv/lib/python*/site-packages/rasterio/proj_data")
)
if proj_data_paths:
    import os

    os.environ.setdefault("PROJ_DATA", proj_data_paths[0])
    os.environ.setdefault("PROJ_LIB", proj_data_paths[0])

# Application definition
ASGI_APPS = [
    "daphne",
]

DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.gis",
]

THIRD_PARTY_APPS = [
    "channels",
    "rest_framework",
    "rest_framework_simplejwt",
    "drf_spectacular",
    "corsheaders",
]

LOCAL_APPS = [
    "apps.identity.apps.IdentityConfig",
    "apps.guide.apps.GuideConfig",
    "apps.tracking.apps.TrackingConfig",
    "apps.sos.apps.SosConfig",
    "apps.notifications.apps.NotificationsConfig",
    "apps.listings.apps.ListingsConfig",
    "apps.adminpanel.apps.AdminpanelConfig",
    "apps.assistant.apps.AssistantConfig",
    "apps.poi.apps.PoiConfig",
]

INSTALLED_APPS = ASGI_APPS + DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "safarsetu.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "safarsetu.wsgi.application"
ASGI_APPLICATION = "safarsetu.asgi.application"

# Database Configuration using django-environ
# Supports postgres://, postgis://, sqlite:///, etc.
DATABASES = {
    "default": env.db(
        "DATABASE_URL",
        default="postgres://safarsetu_user:safarsetu_password@localhost:5432/safarsetu",
    )
}

# Redis Cache Configuration
CACHES = {
    "default": env.cache(
        "REDIS_URL",
        default="redis://127.0.0.1:6379/1",
    )
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"] if (BASE_DIR / "static").exists() else []
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Media files
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# Default primary key field type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Django REST Framework Settings
REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.BasicAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
    ],
}

# SimpleJWT Settings for Tourist & User Authentication
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": False,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# OpenAPI Docs / DRF Spectacular Settings
SPECTACULAR_SETTINGS = {
    "TITLE": "SafarSetu API",
    "DESCRIPTION": (
        "Modular Monolith Backend API for SafarSetu — a comprehensive platform "
        "for tourism guide, live tracking, SOS emergency alerts, listings, "
        "notifications, smart assistant, and administrative control."
    ),
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "SCHEMA_PATH_PREFIX": r"/api/v[0-9]",
    "COMPONENT_SPLIT_REQUEST": True,
    "ENUM_NAME_OVERRIDES": {
        "UserRoleEnum": "apps.identity.models.UserRole",
        "MessageRoleEnum": "apps.assistant.models.MessageRole",
        "BookingStatusEnum": "apps.guide.models.BookingStatus",
        "SOSStatusEnum": "apps.sos.models.SOSStatus",
    },
}

# CORS Headers Settings
CORS_ALLOW_ALL_ORIGINS = env("CORS_ALLOW_ALL_ORIGINS")
CORS_ALLOWED_ORIGINS = env("CORS_ALLOWED_ORIGINS")
CORS_ALLOW_CREDENTIALS = True

# Django Channels & WebSocket Channel Layers
USE_IN_MEMORY_CHANNEL_LAYER = env.bool("USE_IN_MEMORY_CHANNEL_LAYER", default=False)
if USE_IN_MEMORY_CHANNEL_LAYER:
    CHANNEL_LAYERS = {
        "default": {
            "BACKEND": "channels.layers.InMemoryChannelLayer",
        }
    }
else:
    CHANNEL_LAYERS = {
        "default": {
            "BACKEND": "channels_redis.core.RedisChannelLayer",
            "CONFIG": {
                "hosts": [env("REDIS_URL", default="redis://127.0.0.1:6379/2")],
            },
        },
    }

# Celery Configuration
CELERY_BROKER_URL = env(
    "CELERY_BROKER_URL", default=env("REDIS_URL", default="redis://127.0.0.1:6379/1")
)
CELERY_RESULT_BACKEND = env(
    "CELERY_RESULT_BACKEND",
    default=env("REDIS_URL", default="redis://127.0.0.1:6379/1"),
)
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = "Asia/Kolkata"
CELERY_ENABLE_UTC = True
CELERY_TASK_TRACK_STARTED = True
CELERY_TASK_TIME_LIMIT = 30 * 60

# Celery Queue Architecture: Default and SOS (high priority)
from kombu import Exchange, Queue  # noqa: E402

CELERY_TASK_DEFAULT_QUEUE = "default"
CELERY_TASK_QUEUES = (
    Queue("default", Exchange("default"), routing_key="default"),
    Queue("sos", Exchange("sos"), routing_key="sos"),
)

CELERY_TASK_ROUTES = {
    "apps.sos.tasks.*": {"queue": "sos"},
    "safarsetu.sos_*": {"queue": "sos"},
    "safarsetu.tasks.sos_*": {"queue": "sos"},
    "*": {"queue": "default"},
}

# Celery Beat Periodic Tasks
CELERY_BEAT_SCHEDULE = {
    "scan-missed-checkins-every-minute": {
        "task": "apps.sos.tasks.check_missed_checkins",
        "schedule": 60.0,
        "options": {"queue": "sos"},
    },
}
