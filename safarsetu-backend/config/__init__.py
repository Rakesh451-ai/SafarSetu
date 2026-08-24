"""
Config package initialization for SafarSetu backend.
"""
from .celery import app as celery_app

__all__ = ('celery_app',)
