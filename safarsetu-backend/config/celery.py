import os
from celery import Celery
from celery.schedules import crontab

# Set default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('safarsetu')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()

app.conf.beat_schedule = {
    'check-missed-checkins-every-5-minutes': {
        'task': 'journeys.tasks.check_missed_checkins_task',
        'schedule': 300.0,
    },
    'cleanup-expired-alerts-every-hour': {
        'task': 'safety.tasks.cleanup_expired_alerts_task',
        'schedule': 3600.0,
    },
}


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
