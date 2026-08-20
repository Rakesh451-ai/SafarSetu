#!/bin/bash
set -e

echo "🚀 Running SafarSetu Docker Entrypoint..."

# Wait for database if DATABASE_URL is postgres
if [[ "$DATABASE_URL" == *"postgres"* ]]; then
  echo "⏳ Waiting for PostgreSQL database connection..."
  python -c "
import sys, time, os
from urllib.parse import urlparse
import psycopg2

db_url = os.environ.get('DATABASE_URL', '')
if db_url.startswith('postgres://') or db_url.startswith('postgresql://'):
    result = urlparse(db_url)
    username = result.username
    password = result.password
    database = result.path[1:]
    hostname = result.hostname
    port = result.port or 5432
    connected = False
    for i in range(30):
        try:
            conn = psycopg2.connect(dbname=database, user=username, password=password, host=hostname, port=port)
            conn.close()
            print('✅ PostgreSQL database is available!')
            connected = True
            break
        except Exception as e:
            print(f'Waiting for db... ({e})')
            time.sleep(1)
    if not connected:
        print('⚠️ Could not connect to PostgreSQL within 30s, proceeding anyway...')
"
fi

# Run database migrations
echo "🗄️ Applying database migrations..."
python manage.py migrate --noinput

# Collect static files
echo "🎨 Collecting static assets..."
python manage.py collectstatic --noinput

echo "✅ Entrypoint tasks completed. Starting application command..."
exec "$@"
