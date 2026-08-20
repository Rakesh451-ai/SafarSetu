#!/bin/bash
set -e

echo "🚀 Starting SafarSetu Deployment Routine..."
cd "$(dirname "$0")/.."

# 1. Activate virtualenv
if [ -d ".venv" ]; then
    source .venv/bin/activate
fi

# 2. Install / upgrade dependencies
echo "📦 Installing requirements..."
pip install -r requirements.txt

# 3. Database migrations
echo "🗄️ Running database migrations..."
python manage.py migrate --noinput

# 4. Collect static assets
echo "🎨 Collecting static assets..."
python manage.py collectstatic --noinput

# 5. Restart services or run standalone
if command -v systemctl >/dev/null 2>&1 && systemctl is-active --quiet safarsetu 2>/dev/null; then
    echo "🔄 Reloading systemd services..."
    sudo systemctl restart safarsetu safarsetu-celery safarsetu-beat
    echo "✅ Systemd services restarted successfully!"
else
    echo "⚡ Starting Daphne ASGI server on port 8000..."
    daphne -b 0.0.0.0 -p ${PORT:-8000} safarsetu.asgi:application
fi
