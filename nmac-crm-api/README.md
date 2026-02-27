# NMAC CRM Backend API

FastAPI backend for authentication, users, patients, appointments, recalls, and communication workflows.

## Tech Stack
- Python 3.12
- FastAPI
- Tortoise ORM + Aerich
- Redis
- APScheduler
- Jinja2 templates

## Project Layout
- `app/`: app bootstrap, config, auth/token, shared utilities
- `routes/`: modular route groups auto-mounted by folder
- `applications/`: Tortoise ORM models by domain
- `tasks/`: scheduled jobs loaded at startup
- `templates/`: HTML/email templates and static assets
- `compose.yml`: Docker setup for API + Redis

## Route Groups
The app mounts each route folder under `/{folder}`:
- `/auth`
- `/user`
- `/agent`
- `/patient`
- `/appointment`
- `/recall`
- `/communications`
- `/manager`
- `/site`

Notes:
- Root endpoint: `GET /`
- Sub-app docs: `/{group}/docs` (example: `/auth/docs`)

## Local Setup
1. Create and activate a virtual environment (recommended; keeps dependencies isolated):
```bash
python3 -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate
```
2. Install dependencies:
```bash
pip install -r requirements.txt
```
3. Configure environment variables in `.env`.
4. Run migrations:
```bash
aerich init-db
aerich migrate
aerich upgrade
```
5. Start API:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Docker Setup
```bash
docker compose up --build
```

## Environment Variables
Use the `.env` file in the repo root.

| Variable | Description | Example |
|---|---|---|
| `DEBUG` | Enable debug mode and seed dummy data on startup. | `true` |
| `APP_NAME` | App display name. | `NMAC CRM` |
| `ENV` | Runtime environment (`development`/`production`). | `development` |
| `BASE_URL` | Public API base URL used by file URL helpers. | `http://localhost:8000/` |
| `MEDIA_DIR` | Local media folder path. | `media/` |
| `MEDIA_ROOT` | Public media URL segment. | `media/` |
| `DB_ENGINE` | Database engine (`sqlite`, `postgres`, `mysql`, etc.). | `sqlite` |
| `DB_HOST` | Database host (used when `DATABASE_URL` is empty). | `localhost` |
| `DB_PORT` | Database port. | `5432` |
| `DB_NAME` | Database name or sqlite filename. | `db.sqlite3` |
| `DB_USER` | Database username. | `postgres` |
| `DB_PASSWORD` | Database password. | `your_password` |
| `DATABASE_URL` | Optional full DB URL override. | `postgres://user:pass@host:5432/dbname` |
| `REDIS_URL` | Redis connection URL. | `redis://redis:6379/0` |
| `EMAIL_HOST` | SMTP host. | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port. | `587` |
| `EMAIL_HOST_USER` | SMTP username/email. | `example@gmail.com` |
| `EMAIL_HOST_PASSWORD` | SMTP password/app password. | `app_password` |
| `DEFAULT_FROM_EMAIL` | Default sender email. | `example@gmail.com` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token lifetime in minutes. | `10` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token lifetime in days. | `30` |
| `SECRET_KEY` | JWT secret for access tokens. | `change-me-access-secret` |
| `REFRESH_SECRET_KEY` | JWT secret for refresh tokens. | `change-me-refresh-secret` |
| `SMS_API` | SMS provider API key (`api.sms.net.bd`). | `your_sms_api_key` |

## Runtime Notes
- `DATABASE_URL` takes priority when set. If empty, DB URL is built from `DB_*` variables.
- APScheduler loads tasks from `tasks/*.py` during app startup.
- Redis is initialized at app startup via `REDIS_URL`.
