web: daphne -b 0.0.0.0 -p ${PORT:-8000} safarsetu.asgi:application
worker: celery -A safarsetu worker -l INFO -Q default,sos -c 2
beat: celery -A safarsetu beat -l INFO
