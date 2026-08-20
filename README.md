# SafarSetu 🧭

[![Django](https://img.shields.io/badge/Django-5.1.6-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/Django_REST_Framework-3.15.2-red?style=for-the-badge&logo=django&logoColor=white)](https://www.django-rest-framework.org/)
[![Google Sign-In](https://img.shields.io/badge/Google-Sign--In%20OAuth2-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/identity)
[![SimpleJWT](https://img.shields.io/badge/JWT-SimpleJWT%205.3.1-black?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://django-rest-framework-simplejwt.readthedocs.io/)
[![Database](https://img.shields.io/badge/Database-SQLite%20%7C%20PostgreSQL%20%7C%20Supabase-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Python](https://img.shields.io/badge/Python-3.12+-blue?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**SafarSetu** is a modern, interactive tourist safety, digital identity, and smart exploration platform built with **Django 5** and **Django REST Framework (DRF)**. It combines cryptographic Digital Tourist IDs, real-time geofenced Safety Radar, 1-tap SOS emergency dispatch, verified tour guide bookings, and an AI-powered travel assistant into a mobile-first Progressive Web Application (PWA).

---

## ✨ Key Features & Capabilities

- 🔐 **Modern & Interactive Authentication**:
  - **Login with Google**: Seamless "Continue with Google" OAuth2 authentication and Google Identity Services (GSI) support with instant automatic digital pass generation.
  - **Dual Email or Username**: Log in with either your registered username or email address (case-insensitive).
  - **Interactive UI**: Show/hide password toggles, animated loading submit states, and clean validation error banners.
  - **Interactive Sign-Out Modal**: Confirms session termination with animated modal sheet and safe token clearing.
  - **⚡ 1-Click Fast Demo Login**: Quick-access one-click evaluator logins for **Tourist**, **Tour Guide**, **Emergency Responder (112)**, and **Admin**.
- 🪪 **Cryptographic Digital Tourist ID**: Generates tamper-evident, PyJWT SHA-256 signed QR code passes for tourists and monument check-ins.
- 📡 **Safety Radar & Geofencing**: Real-time GPS location ingestion, 3-tier risk zone classification (*Safe*, *Caution*, *Danger*), and boundary transition alerts.
- 🚨 **1-Tap Emergency SOS (112)**: Instant distress broadcasting to police command centers, automated dispatch tracking, and emergency contact SMS notifications.
- 🏛️ **Verified Guide Directory & Bookings**: Browse government-verified local guides, explore curated tour packages, and manage bookings.
- 🤖 **AI Travel Assistant & RAG**: Instant conversational assistance for itinerary generation, safety advisories, and historical monument details.
- 📱 **Mobile-First Responsive PWA**: Dark navy & gold Rajasthan aesthetic, installable Web App Manifest, offline service workers, and interactive maps.
- 🆓 **Zero-Cost Free Tier Database Support**: Built-in **SQLite** default requires zero external database servers, zero cost, and runs out-of-the-box on Render, Railway, Fly.io, PythonAnywhere, or any free hosting platform. Automatically switches to **PostgreSQL / Supabase / Neon** when `DATABASE_URL` is set.

---

## 🏗️ Architecture: Modular Monolith

The codebase is organized into clean domain modules under `apps/`:

```
SafarSetu/
├── apps/
│   ├── identity/        # Auth, Google OAuth2, SimpleJWT, User Profiles, Digital Pass QR
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
│   ├── settings/        # base.py (SQLite default + PostgreSQL fallback), dev.py, prod.py
│   ├── asgi.py          # ASGI application entrypoint (Daphne & Channels)
│   ├── wsgi.py          # WSGI application entrypoint
│   └── urls.py          # Central routing & OpenAPI documentation
├── static/              # CSS, JavaScript, PWA assets, icons
├── templates/           # Mobile-first responsive HTML templates & modal components
├── tests/               # Automated test suite (58 tests, 100% passing)
├── Dockerfile           # Multi-stage production & development Dockerfile
├── docker-compose.yml   # Multi-container orchestration (PostGIS, Redis, Django)
├── manage.py
└── requirements.txt     # Pinned Python dependencies
```

---



## 🚀 How to Run on Local Server

Follow these simple steps to run SafarSetu locally on your machine:

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

*(The default `.env` is already configured for zero-setup SQLite development. No external database or Redis server is required to start!)*

---

### Step 5: Apply Database Migrations

```bash
python manage.py migrate
```

---

### Step 6: Initialize Demo User Accounts

Run the built-in demo provisioning command to set up test accounts for all roles:

```bash
python manage.py setup_auth_demo
```

---

### Step 7: Start the Development Server

```bash
python manage.py runserver
```

Open your browser and navigate to:
👉 **[http://127.0.0.1:8000/](http://127.0.0.1:8000/)**

---

## 🔑 Login & Evaluation Credentials

You can sign in with **Google**, use the **⚡ 1-Click Fast Demo Login** buttons on `/login/`, or enter credentials manually:

| Role | Username / Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **🌐 Google User** | `Continue with Google` button | *(Google Account)* | Instant Verified Tourist Pass & QR |
| **🧭 Tourist** | `tourist_demo` or `tourist@safarsetu.gov.in` | `Tourist123!` | Alex Morgan (Aadhaar Verified Digital Pass) |
| **🏛️ Tour Guide** | `guide_demo` or `guide@safarsetu.gov.in` | `Guide123!` | Rajesh Kumar (Govt Verified Guide, 8 yrs exp) |
| **🚨 Responder** | `responder_demo` or `responder@safarsetu.gov.in` | `Responder123!` | Inspector Vikram Singh (Jaipur Police 112) |
| **⚙️ Admin** | `admin_demo` or `admin@safarsetu.gov.in` | `Admin123!` | Dr. Anita Sharma (Ministry Administrator) |

---

## ☁️ Zero-Cost Free Database Deployment

SafarSetu is optimized to deploy **completely free** on any cloud provider:

1. **Default Zero-Config SQLite (Free Anywhere)**:
   - Works natively out of the box with zero external database configuration.
   - Ideal for single-instance free containers on **Render**, **Railway**, **Fly.io**, **PythonAnywhere**, or VPS.
2. **Cloud PostgreSQL Free Tiers (Supabase / Neon / Aiven)**:
   - Create a free database on [Supabase](https://supabase.com/) or [Neon](https://neon.tech/).
   - Set the `DATABASE_URL` environment variable in your deployment dashboard:
     ```env
     DATABASE_URL=postgres://postgres:password@ep-sample-123.us-east-2.aws.neon.tech/neondb?sslmode=require
     ```
   - Django automatically connects to PostgreSQL with SSL encryption!

---

## 📚 API Documentation & Interactive Endpoints

Interactive OpenAPI 3.0 documentation is powered by `drf-spectacular`:

- **Swagger UI**: [http://127.0.0.1:8000/api/docs/](http://127.0.0.1:8000/api/docs/)
- **ReDoc**: [http://127.0.0.1:8000/api/redoc/](http://127.0.0.1:8000/api/redoc/)
- **OpenAPI Schema (YAML)**: [http://127.0.0.1:8000/api/schema/](http://127.0.0.1:8000/api/schema/)
- **Health Check**: [http://127.0.0.1:8000/api/health/](http://127.0.0.1:8000/api/health/)

### Key Authentication & Core Endpoints (`/api/v1/`):

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/google/` | Sign in with Google ID token / credential |
| `POST` | `/api/v1/auth/login/` | Obtain SimpleJWT tokens and user profile |
| `POST` | `/api/v1/auth/register/` | Unified registration for Tourists, Guides, and Staff |
| `GET` | `/api/v1/auth/me/` | Current user profile, active digital pass, and role |
| `PATCH`| `/api/v1/auth/profile/` | Update profile information and emergency contacts |
| `POST` | `/api/v1/auth/change-password/` | Update password securely |
| `POST` | `/api/v1/auth/logout/` | Blacklist refresh token & clear session |
| `GET` | `/api/v1/id/<uuid:tourist_id>/qr/` | Signed PyJWT token & base64 PNG QR pass |
| `POST` | `/api/v1/location/ping/` | Ingest live GPS coordinate telemetry ping |
| `GET` | `/api/v1/zones/` | GeoJSON export of monitored safety and danger zones |
| `POST` | `/api/v1/sos/` | Trigger immediate 1-tap SOS distress alert |
| `POST` | `/api/v1/scan/` | Unified QR code scanning & gate validation |
| `POST` | `/api/v1/assistant/query/` | AI tourist assistant conversational query |
| `POST` | `/api/v1/itinerary/generate/` | AI safe itinerary generator filtered by safety zones |
| `GET` | `/api/v1/guides/` | Browse verified tourist guides |
| `POST` | `/api/v1/bookings/` | Book a guided tour package |

---

## 🧪 Automated Testing

Run the automated test suite across all modules:

```bash
python manage.py test
```

To run only the authentication test suite (including Google Sign-In):

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
