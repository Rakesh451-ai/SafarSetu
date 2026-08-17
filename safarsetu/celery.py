import os
import time

from celery import Celery

# Set default Django settings module for 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "safarsetu.settings.dev")

app = Celery("safarsetu")

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix in settings.py.
app.config_from_object("django.conf:settings", namespace="CELERY")

# Load task modules from all registered Django apps.
app.autodiscover_tasks()


@app.task(bind=True, name="safarsetu.debug_task", queue="default")
def debug_task(self):
    """
    Trivial debug task running on the 'default' queue to verify worker execution.
    """
    time_str = time.strftime("%Y-%m-%d %H:%M:%S")
    return {
        "status": "success",
        "task_id": self.request.id,
        "queue": "default",
        "timestamp": time_str,
        "message": f"SafarSetu Celery default worker is operational at {time_str}!",
    }


@app.task(bind=True, name="safarsetu.sos_ping_task", queue="sos")
def sos_ping_task(self, alert_id: str = "test-alert"):
    """
    High-priority trivial task running on the dedicated 'sos' queue.
    """
    time_str = time.strftime("%Y-%m-%d %H:%M:%S")
    return {
        "status": "success",
        "task_id": self.request.id,
        "queue": "sos",
        "alert_id": alert_id,
        "priority": "HIGH",
        "timestamp": time_str,
        "message": f"SafarSetu SOS emergency high-priority queue is operational for alert '{alert_id}'!",
    }
