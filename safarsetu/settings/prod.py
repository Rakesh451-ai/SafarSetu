"""
Production settings for SafarSetu project.
Hardened for secure and performant deployment.
"""

from .base import *  # noqa: F401, F403
from .base import env  # noqa: F401

DEBUG = False

ALLOWED_HOSTS = env.list(
    "DJANGO_ALLOWED_HOSTS", default=["localhost", "127.0.0.1", "0.0.0.0"]
)

# CSRF Trusted Origins for HTTPS/Domain deployments
CSRF_TRUSTED_ORIGINS = env.list("CSRF_TRUSTED_ORIGINS", default=[])
if not CSRF_TRUSTED_ORIGINS:
    for host in ALLOWED_HOSTS:
        if host not in ["*", "localhost", "127.0.0.1", "0.0.0.0", "web"]:
            CSRF_TRUSTED_ORIGINS.append(f"https://{host}")
            CSRF_TRUSTED_ORIGINS.append(f"http://{host}")

# Ensure Secret Key is properly set
SECRET_KEY = env("DJANGO_SECRET_KEY")

# Security Settings
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = env.bool("DJANGO_SECURE_SSL_REDIRECT", default=False)
SESSION_COOKIE_SECURE = env.bool("DJANGO_SESSION_COOKIE_SECURE", default=False)
CSRF_COOKIE_SECURE = env.bool("DJANGO_CSRF_COOKIE_SECURE", default=False)
SECURE_HSTS_SECONDS = env.int("DJANGO_SECURE_HSTS_SECONDS", default=0)
SECURE_HSTS_INCLUDE_SUBDOMAINS = env.bool(
    "DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS", default=False
)
SECURE_HSTS_PRELOAD = env.bool("DJANGO_SECURE_HSTS_PRELOAD", default=False)
SECURE_CONTENT_TYPE_NOSNIFF = True

# CORS Production Settings
CORS_ALLOW_ALL_ORIGINS = env.bool("CORS_ALLOW_ALL_ORIGINS", default=False)
CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS", default=[])

# Email Configuration for Production
EMAIL_BACKEND = env(
    "DJANGO_EMAIL_BACKEND", default="django.core.mail.backends.smtp.EmailBackend"
)
