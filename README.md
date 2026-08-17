# SafarSetu 🧭

**SafarSetu** is a modular monolith backend platform built with **Django 5** and **Django REST Framework (DRF)**, tailored for tourism, real-time location tracking, SOS emergency response, interactive guide bookings, tourist attraction listings, smart AI assistance, and central administration.

---

## 🏛 Architecture: Modular Monolith

The codebase is organized into bounded contexts within the `apps/` directory:

```
safarsetu/
├── apps/
│   ├── identity/        # User authentication, roles (Tourist, Guide, Responder, Admin)
│   ├── guide/           # Local guides, itineraries, packages, bookings
│   ├── tracking/        # Real-time GPS telemetry, trip routes, breadcrumbs
│   ├── sos/             # Emergency SOS incident alerts and responder coordination
│   ├── notifications/   # System alerts, SMS/Push notification logs, inbox
│   ├── listings/        # Tourist destinations, attractions, hotels, reviews
│   ├── adminpanel/      # System metrics, audit logs, administration overview
│   └── assistant/       # AI travel assistant conversation and query handling
├── safarsetu/
│   ├── settings/
│   │   ├── base.py      # Common configuration, DRF, Spectacular, CORS
│   │   ├── dev.py       # Development settings (debug enabled, local fallbacks)
│   │   └── prod.py      # Production hardening (SSL, strict security headers)
│   ├── asgi.py          # ASGI application entrypoint
│   ├── wsgi.py          # WSGI application entrypoint
│   └── urls.py          # Central routing and OpenAPI docs
├── Dockerfile           # Multi-stage production & dev Dockerfile with GDAL/PostGIS
├── docker-compose.yml   # Django web, PostgreSQL 16 + PostGIS, Redis
├── pyproject.toml       # Project metadata, pinned dependencies, tool configs
├── requirements.txt     # Pinned production and development packages
├── .pre-commit-config.yaml # Black, isort, Flake8 pre-commit hooks
└── manage.py
```

---

## 🚀 Quick Start

### 1. Using Docker Compose (Recommended)

Start all services (Django + PostgreSQL with PostGIS + Redis):

```bash
docker compose up --build
```

Run migrations inside the container:

```bash
docker compose exec web python manage.py migrate
```

Create a superuser:

```bash
docker compose exec web python manage.py createsuperuser
```

The server will be live at `http://localhost:8000`.

---

### 2. Local Setup (Virtual Environment)

1. **Activate Virtual Environment**:
   ```bash
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```

3. **Run Migrations**:
   ```bash
   python manage.py migrate
   ```

4. **Start Development Server**:
   ```bash
   python manage.py runserver
   ```

---

## 📚 API Documentation & Endpoints

Interactive OpenAPI documentation is powered by **drf-spectacular**:

- **Swagger UI**: [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)
- **ReDoc**: [http://localhost:8000/api/redoc/](http://localhost:8000/api/redoc/)
- **OpenAPI Schema (YAML/JSON)**: [http://localhost:8000/api/schema/](http://localhost:8000/api/schema/)
- **Health Check**: [http://localhost:8000/api/health/](http://localhost:8000/api/health/)

### Core API Routes (`/api/v1/`):
- `POST /api/v1/identity/register/` - Register new user
- `GET  /api/v1/identity/me/` - Current authenticated user
- `GET  /api/v1/guide/guides/` - List verified guides
- `GET  /api/v1/guide/packages/` - Tour packages
- `POST /api/v1/tracking/pings/` - Ingest GPS telemetry ping
- `GET  /api/v1/tracking/trips/` - Tourist trip history
- `POST /api/v1/sos/events/` - Trigger SOS emergency
- `GET  /api/v1/notifications/` - User notifications inbox
- `GET  /api/v1/listings/` - Tourist attractions and destinations
- `GET  /api/v1/adminpanel/audit-logs/` - Admin audit logging
- `POST /api/v1/assistant/conversations/` - Create smart assistant chat session

---

## 🛠 Code Quality & Formatting

Pre-commit hooks are configured for **Black**, **isort**, and **Flake8**:

```bash
# Run formatters
black .
isort .

# Run linter
flake8 .

# Run pre-commit across all files
pre-commit run --all-files
```
