#!/bin/bash
set -e

echo "🚀 Starting SafarSetu Linux Deployment (Option C)..."
cd "$(dirname "$0")/.."

# 1. Activate virtualenv
source .venv/bin/activate

# 2. Install dependencies
echo "📦 Installing requirements..."
pip install -r requirements.txt

# 3. Database migrations
echo "🗄️ Running database migrations..."
python manage.py migrate

# 4. Collect static assets
echo "🎨 Collecting static assets..."
python manage.py collectstatic --noinput

# 5. Start Daphne ASGI server
echo "⚡ Starting Daphne ASGI server on port 8000..."
daphne -b 0.0.0.0 -p 8000 safarsetu.asgi:application
