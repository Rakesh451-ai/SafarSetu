# SafarSetu 🧭

[![Django](https://img.shields.io/badge/Django-5.1.6-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/Django_REST_Framework-3.15.2-red?style=for-the-badge&logo=django&logoColor=white)](https://www.django-rest-framework.org/)
[![SimpleJWT](https://img.shields.io/badge/JWT-SimpleJWT%205.3.1-black?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://django-rest-framework-simplejwt.readthedocs.io/)
[![Python](https://img.shields.io/badge/Python-3.12+-blue?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**SafarSetu** is a comprehensive, modern tourist safety, digital identity, and smart exploration platform built with **Django 5** and **Django REST Framework (DRF)**. It combines cryptographic Digital Tourist IDs, real-time geofenced Safety Radar, 1-tap SOS emergency dispatch, verified tour guide bookings, and an AI-powered travel assistant into a mobile-first Progressive Web Application (PWA).

---

## ✨ Features

- 🪪 **Cryptographic Digital Tourist ID**: Generates tamper-evident, PyJWT SHA-256 signed QR code passes for tourists and monument check-ins.
- 🔐 **Modern Multi-Role Authentication**: Seamless dual authentication via Web Sessions and REST SimpleJWT tokens (with custom role & profile claims). Supports login via **Username OR Email**.
- ⚡ **1-Click Demo Evaluation**: Instant demo login buttons for **Tourist**, **Local Guide**, **Emergency Responder (112)**, and **Administrator**.
- 📡 **Safety Radar & Geofencing**: Real-time GPS location ingestion, 3-tier risk zone classification (*Safe*, *Caution*, *Danger*), and boundary transition alerts.
- 🚨 **1-Tap Emergency SOS (112)**: Instant distress broadcasting to police command centers, automated dispatch tracking, and emergency contact SMS notifications.
- 🏛️ **Verified Guide Directory & Bookings**: Browse government-verified local guides, explore curated tour packages, and manage bookings.
- 🤖 **AI Travel Assistant & RAG**: Instant conversational assistance for itinerary generation, safety advisories, and historical monument details.
- 📱 **Mobile-First Responsive PWA**: Dark navy & gold Rajasthan aesthetic, installable Web App Manifest, offline service workers, and interactive maps.

---

## 🏗️ Architecture: Modular Monolith

The codebase is organized into bounded domain contexts under the `apps/` directory:

```
SafarSetu/
├── apps/
│   ├── identity/        # Auth, JWT, User Profiles, Digital ID passes, QR service
│   ├── guide/           # Verified tour guides, tour packages, bookings
│   ├── tracking/        # GPS telemetry, geofencing, hazard zones
│   ├── sos/             # Emergency SOS incidents, check-in schedules, dispatch
│   ├── listings/        # Verified stays, hotels, transport, attractions
│   ├── notifications/   # Push/SMS notifications, broadcast alerts
│   ├── poi/             # Points of interest, gate QR scanning, tour briefs
│   ├── assistant/       # AI travel assistant, itinerary generator
│   ├── adminpanel/      # Command center metrics, incident triage, audit logs
│   └── web/             # PWA views, mobile templates, AJAX endpoints
├── safarsetu/
│   ├── settings/        # base.py, dev.py, prod.py
│   ├── asgi.py          # ASGI application entrypoint (Daphne & Channels)
│   ├── wsgi.py          # WSGI application entrypoint
│   └── urls.py          # Central routing & OpenAPI documentation
├── static/              # CSS, JavaScript, PWA assets, icons
├── templates/           # Mobile-first responsive HTML templates
├── tests/               # Comprehensive automated test suite (56 tests)
├── Dockerfile           # Multi-stage production & development Dockerfile
├── docker-compose.yml   # Multi-container orchestration (PostGIS, Redis, Django)
├── manage.py
└── requirements.txt     # Pinned Python dependencies
```

---



## 🚀 How to Run on Local Server

### Run this command to run on local server

Clone the repo 
cd SafarSetu
python -m venv venv
source venv/bin/activate   -- it is for linux   
venv\scripts\activate  -- for windows 

pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver



Follow these simple steps to run SafarSetu on your local machine:

### Prerequisites

- **Python 3.12+** installed on your system.
- **Git** installed.

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/Rakesh451-ai/SafarSetu.git
cd SafarSetu
```

---

### Step 2: Create and Activate a Virtual Environment

```bash
# On Linux / macOS
python3 -m venv .venv
source .venv/bin/activate

# On Windows (PowerShell)
python -m venv .venv
.venv\Scripts\Activate.ps1

# On Windows (Command Prompt)
.venv\Scripts\activate.bat
```

---

### Step 3: Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

---

### Step 4: Configure Environment Variables

Copy the example environment file to `.env`:

```bash
cp .env.example .env
```

*(The default `.env` is already configured for local SQLite development without requiring external databases or Docker!)*

---

### Step 5: Apply Database Migrations

```bash
python manage.py migrate
```

---

### Step 6: Initialize Demo Accounts

Run the built-in demo provisioning command to set up test accounts across all roles:

```bash
python manage.py setup_auth_demo
```

---

### Step 7: Start the Development Server

```bash
python manage.py runserver
```

Open your browser and visit:
👉 **[http://127.0.0.1:8000/](http://127.0.0.1:8000/)**

---

## 👥 Demo Login Credentials

For quick evaluation, you can use the **⚡ 1-Click Fast Demo Login** buttons on the login page or enter these credentials:

| Role | Username / Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **🧭 Tourist** | `tourist_demo` or `tourist@safarsetu.gov.in` | `Tourist123!` | Alex Morgan (Aadhaar Verified Digital Pass) |
| **🏛️ Tour Guide** | `guide_demo` or `guide@safarsetu.gov.in` | `Guide123!` | Rajesh Kumar (Govt Verified Guide, 8 yrs exp) |
| **🚨 Responder** | `responder_demo` or `responder@safarsetu.gov.in` | `Responder123!` | Inspector Vikram Singh (Jaipur Police 112) |
| **⚙️ Admin** | `admin_demo` or `admin@safarsetu.gov.in` | `Admin123!` | Dr. Anita Sharma (Ministry Administrator) |

---

## 🐳 Alternative Setup: Docker Compose

If you have Docker installed, you can spin up the full stack (Django + PostgreSQL with PostGIS + Redis) in one command:

```bash
# Start all containers
docker compose up --build

# Run migrations inside container
docker compose exec web python manage.py migrate

# Initialize demo users
docker compose exec web python manage.py setup_auth_demo
```

Access the app at `http://localhost:8000/`.

---

## 📚 API Documentation & Interactive Endpoints

SafarSetu includes interactive OpenAPI 3.0 documentation powered by `drf-spectacular`:

- **Swagger UI**: [http://127.0.0.1:8000/api/docs/](http://127.0.0.1:8000/api/docs/)
- **ReDoc**: [http://127.0.0.1:8000/api/redoc/](http://127.0.0.1:8000/api/redoc/)
- **OpenAPI Schema (YAML)**: [http://127.0.0.1:8000/api/schema/](http://127.0.0.1:8000/api/schema/)
- **Health Check**: [http://127.0.0.1:8000/api/health/](http://127.0.0.1:8000/api/health/)

### Key API Endpoints (`/api/v1/`):

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login/` | Obtain JWT access/refresh tokens and user profile |
| `POST` | `/api/v1/auth/register/` | Unified registration for Tourists, Guides, and Staff |
| `GET` | `/api/v1/auth/me/` | Current authenticated user profile & active pass |
| `PATCH`| `/api/v1/auth/profile/` | Update profile information and emergency contacts |
| `POST` | `/api/v1/auth/change-password/` | Update password securely |
| `POST` | `/api/v1/auth/logout/` | Blacklist refresh token & logout session |
| `GET` | `/api/v1/id/<uuid:tourist_id>/qr/` | Retrieve signed PyJWT token & base64 PNG QR code |
| `POST` | `/api/v1/location/ping/` | Ingest live GPS coordinate telemetry ping |
| `GET` | `/api/v1/zones/` | GeoJSON export of monitored safety and danger zones |
| `POST` | `/api/v1/sos/` | Trigger immediate 1-tap SOS distress alert |
| `POST` | `/api/v1/scan/` | Unified QR code scanning & gate validation |
| `POST` | `/api/v1/assistant/query/` | AI tourist assistant conversational query |
| `POST` | `/api/v1/itinerary/generate/` | AI safe itinerary generator filtered by safety zones |
| `GET` | `/api/v1/guides/` | Browse verified tourist guides |
| `POST` | `/api/v1/bookings/` | Book a guided tour package |

---

## 🧪 Running Automated Tests

Run the complete automated test suite (56 tests covering authentication, digital IDs, GPS tracking, SOS dispatch, guides, listings, and assistant):

```bash
python manage.py test
```

To run only the authentication test suite:

```bash
python manage.py test tests.test_authentication
```

---

## 🛠️ Code Formatting & Quality

```bash
# Format with Black
black .

# Sort imports
isort .

# Lint with Flake8
flake8 .
```

---

## 🌐 Production Deployment Options

- **Render**: Connect repository and deploy via [`render.yaml`](render.yaml) blueprint.
- **Production Docker Compose**: Run `docker compose -f docker-compose.prod.yml up -d`.
- **Railway / Fly.io / Heroku**: Pre-configured with [`Procfile`](Procfile), [`railway.json`](railway.json), and [`fly.toml`](fly.toml).
- **Ubuntu/Debian VPS**: Automated Systemd and Nginx deployment script in [`deploy/setup_server.sh`](deploy/setup_server.sh).

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
