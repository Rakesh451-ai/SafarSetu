#!/bin/bash
# ==========================================================
# SafarSetu Full Automated Server Setup Script (Ubuntu/Debian)
# ==========================================================
set -e

echo "🚀 Starting SafarSetu Production Server Provisioning..."

# 1. Update system packages
echo "📦 Updating apt packages..."
sudo apt-get update -y
sudo apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    python3-dev \
    build-essential \
    libpq-dev \
    postgresql \
    postgresql-contrib \
    postgis \
    postgresql-16-postgis-3 \
    redis-server \
    nginx \
    gdal-bin \
    libgdal-dev \
    binutils \
    libproj-dev \
    curl \
    git \
    certbot \
    python3-certbot-nginx

# 2. Start and enable Redis & PostgreSQL
echo "⚡ Starting Redis and PostgreSQL..."
sudo systemctl enable redis-server
sudo systemctl start redis-server
sudo systemctl enable postgresql
sudo systemctl start postgresql

# 3. Setup Virtualenv & Dependencies
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

if [ ! -d ".venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv .venv
fi

echo "📦 Installing Python requirements..."
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# 4. Setup Production Environment File if not existing
if [ ! -f ".env" ]; then
    echo "📝 Creating .env from production example..."
    cp .env.production.example .env
    echo "⚠️ Please edit .env with your production secrets and database password."
fi

# 5. Run Database Migrations and Collect Static Files
echo "🗄️ Running migrations..."
python manage.py migrate --noinput

echo "🎨 Collecting static assets..."
python manage.py collectstatic --noinput

# 6. Install Systemd Services
echo "⚙️ Installing Systemd services..."
CURRENT_USER=$(whoami)
sed -i "s|User=rakesh|User=$CURRENT_USER|g" deploy/safarsetu*.service
sed -i "s|Group=rakesh|Group=$CURRENT_USER|g" deploy/safarsetu*.service
sed -i "s|/home/rakesh/SafarSetu|$PROJECT_DIR|g" deploy/safarsetu*.service

sudo cp deploy/safarsetu.service /etc/systemd/system/
sudo cp deploy/safarsetu-celery.service /etc/systemd/system/
sudo cp deploy/safarsetu-beat.service /etc/systemd/system/

sudo systemctl daemon-reload
sudo systemctl enable safarsetu safarsetu-celery safarsetu-beat
sudo systemctl restart safarsetu safarsetu-celery safarsetu-beat

# 7. Configure Nginx Reverse Proxy
echo "🌐 Configuring Nginx reverse proxy..."
sed -i "s|/home/rakesh/SafarSetu|$PROJECT_DIR|g" deploy/safarsetu_nginx.conf
sudo cp deploy/safarsetu_nginx.conf /etc/nginx/sites-available/safarsetu
sudo ln -sf /etc/nginx/sites-available/safarsetu /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo "✅ SafarSetu deployment completed successfully!"
echo "🌐 Application is live via Nginx on port 80!"
