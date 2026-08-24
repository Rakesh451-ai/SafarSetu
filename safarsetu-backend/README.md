# 🛡️ SafarSetu Backend — Digital Tourist Guide & Safety Platform

> **Official REST API & Real-Time Safety Engine for SafarSetu** — Built with Django, Django REST Framework, Simple JWT, PostGIS/Geo-Spatial Architecture, Redis/Celery, and OpenAI RAG Integration.

---

## 🌟 Project Overview

**SafarSetu** (*सफ़र सेतु — Travel Bridge*) is a comprehensive Digital Tourist Guide and Safety Platform for Indian Tourism. The backend provides:
- **Digital Tourist ID & QR Verification**: Tamper-proof, cryptographically secure digital credentials (`SS-IND-XXXXXX`) for verified identification at monument entry gates and police checkpoints.
- **Geo-Fenced Safety Zones & Real-Time Monitoring**: Point-in-polygon spatial detection for `SAFE`, `CAUTION`, and `DANGER` zones with automatic safety status updates.
- **SOS Emergency Dispatch & Triage**: 1-tap critical SOS triggering with live GPS broadcast, emergency contact notifications, and law enforcement dispatch triage.
- **AI Tourist Copilot**: RAG-grounded AI travel assistant backed by official ASI monuments, real-time safety zones, and verified heritage guides.
- **Verified Heritage Guides & Services**: Verified marketplace for certified ASI guides, RTDC-approved heritage hotels, and government pre-paid transport.
- **Smart Itineraries & Missed Check-in Escalation**: Automated Celery task scheduling for check-in safety tracking.

---

## 🏗️ Architecture & Apps

```text
safarsetu-backend/
├── config/             # Core project configuration, ASGI/WSGI, Celery, OpenAPI Swagger
│   ├── settings.py     # Multi-database settings (PostGIS/PostgreSQL & SQLite fallback)
│   ├── urls.py         # Main URL router
│   ├── celery.py       # Celery beat schedules & task autodiscovery
│   ├── asgi.py         # Channels ASGI protocol router
│   ├── exceptions.py   # Standardized error responses ({ success, message, errors })
│   └── pagination.py   # Standard pagination responses
├── accounts/           # Custom User model, Roles (TOURIST, ADMIN, RESPONSE_OPERATOR), JWT Auth
├── tourists/           # Tourist Profiles, Digital Tourist IDs (SS-IND-XXXXXX), Emergency Contacts
├── destinations/       # Heritage Monuments, Audio Guides, Weather, Reviews, Geo-radius Queries
├── safety/             # Geo-fenced Safety Zones, Point-in-Polygon Engine, Live Location & Alerts
├── emergency/          # SOS Emergency Incidents, Dispatch Triage, Operator Management
├── qr/                 # Monument QR Scanner, Digital ID Verification endpoint
├── ai_assistant/       # AI Travel Assistant with RAG context grounding & graceful fallback
├── journeys/           # Travel Circuits, Journey Milestone Check-ins, Celery Missed Check-in jobs
├── itinerary/          # Day-by-day Itineraries, Reordering, Cost Calculation & Route Optimization
├── services/           # Verified Heritage Guides, Hotels, Transport, E-Tickets
├── notifications/      # Notifications Layer (In-app, FCM Push, Emergency Contact Broadcast)
├── admin_dashboard/    # Command Center Analytics, Incident Metrics, Tourist Flow curves
├── requirements.txt    # Production & Development Python Dependencies
├── .env.example        # Environment Variable Blueprint
└── manage.py           # Django Management Utility
```

---

## ⚙️ Requirements

- **Python**: 3.12+
- **Database**:
  - **Production / Recommended**: PostgreSQL 15+ with PostGIS extension
  - **Development Fallback**: SQLite with built-in Shapely/Geopy spatial engine (works out of the box)
- **Redis & Celery**: Optional for local task worker / Redis caching
- **OpenAI API Key**: Optional (system provides rich, verified rule-based responses if no key is supplied)

---

## 🚀 Quickstart & Installation

### 1. Create and Activate Virtual Environment

```bash
# Navigate to backend directory
cd safarsetu-backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# Linux / macOS:
source venv/bin/activate
# Windows (PowerShell):
# .\venv\Scripts\Activate.ps1
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Variables Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` as required:
```ini
SECRET_KEY=your-secure-django-secret-key
DEBUG=True

# Database: Leave empty for SQLite dev fallback or set for PostgreSQL/PostGIS:
DATABASE_URL=postgres://postgres:password@localhost:5432/safarsetu

# Redis & Background Workers
REDIS_URL=redis://localhost:6379/0

# Optional API Keys
OPENAI_API_KEY=your-openai-api-key
MAPBOX_ACCESS_TOKEN=your-mapbox-token
FCM_SERVER_KEY=your-fcm-server-key

ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0,*
```

---

## 🗄️ Database Migrations & Demo Seed Data

### 1. Apply Migrations

```bash
python manage.py migrate
```

### 2. Populate Seed Data

Run the management command to load realistic Indian tourism demo data (monuments, safety zones, verified guides, emergency incidents, and pre-configured accounts):

```bash
python manage.py seed_data
```

**Pre-configured Demo Accounts:**
- **Administrator**: `admin@safarsetu.gov.in` / `Admin@12345`
- **Response Operator**: `operator@safarsetu.gov.in` / `Operator@12345`
- **Tourist (Domestic)**: `aarav.sharma@traveler.in` / `Tourist@12345` (ID: `SS-IND-2026-8849`)
- **Tourist (International)**: `sophie.vdb@traveler.org` / `Tourist@12345` (ID: `SS-INT-2026-3104`)

---

## 🏃 Running the Servers

### 1. Start Django Development Server

```bash
python manage.py runserver 8000
```
Server is available at: **`http://localhost:8000/`**

### 2. Start Celery Worker (Optional for Scheduled Tasks)

```bash
celery -A config worker --loglevel=info
```

### 3. Start Celery Beat (For Periodic Check-in Tracking)

```bash
celery -A config beat --loglevel=info
```

---

## 📖 API Documentation & OpenAPI Specification

- **Interactive Swagger UI**: [`http://localhost:8000/api/docs/`](http://localhost:8000/api/docs/)
- **OpenAPI 3.0 Schema**: [`http://localhost:8000/api/schema/`](http://localhost:8000/api/schema/)
- **Redoc UI**: [`http://localhost:8000/api/redoc/`](http://localhost:8000/api/redoc/)
- **Django Admin Panel**: [`http://localhost:8000/admin/`](http://localhost:8000/admin/)

---

## 🧪 Running Automated Tests

Run the full Django test suite:

```bash
python manage.py test accounts.tests tourists.tests destinations.tests safety.tests emergency.tests qr.tests journeys.tests ai_assistant.tests admin_dashboard.tests
```

---

## 🌐 Connecting the Frontend

1. Ensure the root frontend `.env` points to the backend:
   ```ini
   VITE_API_URL=http://localhost:8000/api
   ```
2. Start the Vite frontend server:
   ```bash
   cd ..
   npm run dev
   ```
3. Open **`http://localhost:5173/`** to interact with the full SafarSetu application.

---

## 📑 Core API Endpoints Reference

| Module | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Health** | `GET` | `/api/health/` | Server health check |
| **Auth** | `POST` | `/api/auth/register/` | Register new tourist account |
| **Auth** | `POST` | `/api/auth/login/` | Login and obtain JWT tokens |
| **Auth** | `POST` | `/api/auth/refresh/` | Refresh expired JWT token |
| **Auth** | `GET` | `/api/auth/me/` | Authenticated user info |
| **Tourists** | `GET` | `/api/tourist/profile/` | Fetch tourist profile & trip status |
| **Tourists** | `PATCH` | `/api/tourist/profile/` | Update profile / preferences |
| **Tourists** | `GET` | `/api/tourist/digital-id/`| Get unique Digital ID & QR code |
| **QR System** | `POST` | `/api/qr/scan/` | Scan monument / kiosk QR code |
| **QR System** | `GET` | `/api/qr/verify/{id}/` | Public verification endpoint for Tourist ID |
| **Destinations**| `GET` | `/api/destinations/` | Search & filter heritage monuments |
| **Destinations**| `GET` | `/api/destinations/{id}/`| Full destination details & audio guides |
| **Destinations**| `GET` | `/api/destinations/nearby/`| Geographic radius search (`?lat=&lng=&radius=`) |
| **Safety** | `GET` | `/api/safety/check/` | Point-in-polygon safety check |
| **Safety** | `GET` | `/api/safety/alerts/` | List active safety alerts |
| **Safety** | `POST` | `/api/safety/location/` | Update live location & get safety status |
| **Emergency** | `POST` | `/api/emergency/sos/` | Trigger instant emergency SOS dispatch |
| **Emergency** | `POST` | `/api/emergency/sos/cancel/`| Cancel / resolve SOS alert |
| **AI Assistant**| `POST` | `/api/ai/chat/` | RAG-grounded AI Travel Assistant |
| **Journeys** | `GET` | `/api/journeys/` | List tourist travel circuits |
| **Journeys** | `POST` | `/api/journeys/check-in/`| Perform safety checkpoint check-in |
| **Itinerary** | `GET` | `/api/itineraries/` | View smart itineraries & reorder |
| **Services** | `GET` | `/api/services/` | Verified guides, stays, and transport |
| **Admin** | `GET` | `/api/admin/dashboard/` | Command Center triage metrics |
