"""
Development settings for SafarSetu project.
Optimized for local development, rapid prototyping, and debugging.
"""

import socket

from .base import *  # noqa: F401, F403
from .base import BASE_DIR, env  # noqa: F401

DEBUG = True

ALLOWED_HOSTS = ["*"]

# Allow all origins in local development
CORS_ALLOW_ALL_ORIGINS = True

# Database configuration with automatic fallback:
# If DATABASE_URL points to PostgreSQL, test if the port is reachable;
# if unreachable (e.g. Docker not installed or Postgres service stopped),
# automatically falls back to SQLite so local development works seamlessly.
db_url_str = env.str("DATABASE_URL", default="")
if not db_url_str or env.bool("USE_SQLITE", default=False):
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }
elif "postgres" in db_url_str or "postgis" in db_url_str:
    try:
        parsed_db = env.db("DATABASE_URL")
        db_host = parsed_db.get("HOST") or "127.0.0.1"
        db_port = int(parsed_db.get("PORT") or 5432)

        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(0.5)
        conn_check = sock.connect_ex((db_host, db_port))
        sock.close()

        if conn_check == 0:
            DATABASES = {"default": parsed_db}
        else:
            DATABASES = {
                "default": {
                    "ENGINE": "django.db.backends.sqlite3",
                    "NAME": BASE_DIR / "db.sqlite3",
                }
            }
    except Exception:
        DATABASES = {
            "default": {
                "ENGINE": "django.db.backends.sqlite3",
                "NAME": BASE_DIR / "db.sqlite3",
            }
        }


# Channel Layers and Redis fallback:
# If Redis is running on port 6379, use RedisChannelLayer; otherwise fallback to InMemoryChannelLayer
def is_redis_available(host="127.0.0.1", port=6379):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(0.5)
        res = s.connect_ex((host, port))
        s.close()
        return res == 0
    except Exception:
        return False


if not is_redis_available() or env.bool("USE_IN_MEMORY_CHANNEL_LAYER", default=False):
    CHANNEL_LAYERS = {
        "default": {
            "BACKEND": "channels.layers.InMemoryChannelLayer",
        }
    }
    # When Redis is not running locally, execute Celery tasks in-memory/eagerly
    CELERY_TASK_ALWAYS_EAGER = True
    CELERY_TASK_EAGER_PROPAGATES = True
    CELERY_BROKER_URL = "memory://"
    CELERY_RESULT_BACKEND = "cache+memory://"

# Email backend for development (prints to console)
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
