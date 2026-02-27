# Environment variables reference

All variables go in **one `.env` file at the repo root** (`nmac-crm/.env`). Copy from `.env.example` and fill in values.

---

## Minimum to run the project (API + frontend)

Set these so the app starts without credential errors:

| Variable | Required | Example | Used in |
|----------|----------|---------|---------|
| `SECRET_KEY` | **Yes** | `change-me-access-secret` | JWT access tokens – `app/token.py` |
| `REFRESH_SECRET_KEY` | **Yes** | `change-me-refresh-secret` | JWT refresh tokens – `app/token.py` |
| `REDIS_URL` | **Yes** | `redis://localhost:6379/0` (local) or `redis://redis:6379/0` (Docker) | Redis connection – `app/redis.py`, `app/main.py` |
| `DB_ENGINE` | **Yes** (for SQLite) | `sqlite` | Database – `app/config.py` |
| `DB_NAME` | If SQLite | `db.sqlite3` | SQLite file – `app/config.py` |
| `VITE_API_BASE_URL` | For frontend | `http://localhost:8000` | Frontend API base – `nmac-crm-frontend/src/redux/baseAPI/baseQuery.ts` |

If you use **Postgres** instead of SQLite, you need: `DB_ENGINE=postgres`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` (or set `DATABASE_URL` instead).

---

## Full list (API – from `app/config.py` and codebase)

### Core / required for run

| Variable | Description | Default / example | Where used |
|----------|-------------|-------------------|------------|
| `SECRET_KEY` | JWT access token secret | `change-me-access-secret` | `app/token.py` |
| `REFRESH_SECRET_KEY` | JWT refresh token secret | `change-me-refresh-secret` | `app/token.py` |
| `REDIS_URL` | Redis URL | `redis://redis:6379/0` or `redis://localhost:6379/0` | `app/redis.py` |
| `DB_ENGINE` | `sqlite` or `postgres` (etc.) | `sqlite` | `app/config.py` |
| `DB_NAME` | DB name or SQLite filename | `db.sqlite3` | `app/config.py` |
| `DB_HOST` | DB host (when not SQLite) | `localhost` | `app/config.py` |
| `DB_PORT` | DB port | `5432` | `app/config.py` |
| `DB_USER` | DB user (when not SQLite) | - | `app/config.py` |
| `DB_PASSWORD` | DB password (when not SQLite) | - | `app/config.py` |
| `DATABASE_URL` | Full DB URL (overrides DB_* if set) | - | `app/config.py` |

### App behavior

| Variable | Description | Default / example | Where used |
|----------|-------------|-------------------|------------|
| `DEBUG` | Debug mode, seed data | `true` | `app/main.py`, `routes/auth/routes.py` |
| `APP_NAME` | App display name | `NMAC CRM` | `app/config.py` |
| `ENV` | `development` / `production` | `development` | `app/main.py`, `app/config.py` |
| `BASE_URL` | Public API base URL | `http://localhost:8000/` | `app/utils/file_manager.py` |
| `MEDIA_DIR` | Local media folder path | `media/` | `app/main.py`, `app/utils/file_manager.py` |
| `MEDIA_ROOT` | Public media URL segment | `media/` | `app/utils/file_manager.py` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token TTL | `10` | `app/token.py` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token TTL | `30` | `app/token.py` |

### Email (optional – only if sending email)

| Variable | Description | Example | Where used |
|----------|-------------|---------|------------|
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` | `app/utils/send_email.py` |
| `EMAIL_PORT` | SMTP port | `587` | `app/utils/send_email.py` |
| `EMAIL_HOST_USER` | SMTP username / email | `you@gmail.com` | `app/utils/send_email.py` |
| `EMAIL_HOST_PASSWORD` | SMTP password / app password | - | `app/utils/send_email.py` |
| `DEFAULT_FROM_EMAIL` | Default sender | Same as `EMAIL_HOST_USER` | `app/config.py` |

### SMS (optional – only if sending SMS)

| Variable | Description | Example | Where used |
|----------|-------------|---------|------------|
| `SMS_API` | api.sms.net.bd API key | - | `app/utils/send_sms.py` |

### WhatsApp / Twilio (optional – only if using WhatsApp)

| Variable | Description | Example | Where used |
|----------|-------------|---------|------------|
| `TWILIO_ACCOUNT_SID` | Twilio Account SID | - | `routes/communications/whatsapp_message.py` |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token | - | `routes/communications/whatsapp_message.py` |

If either is missing, the WhatsApp route will raise: *"TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set in .env"* when that feature is used.

### YouTube (optional)

| Variable | Description | Example | Where used |
|----------|-------------|---------|------------|
| `YOUTUBE_API_KEY` | Google YouTube Data API key | - | `app/utils/yt_video_data.py` |

If unset, YouTube video duration is skipped; no error.

---

## Frontend

| Variable | Description | Example | Where used |
|----------|-------------|---------|------------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000` | `nmac-crm-frontend/src/redux/baseAPI/baseQuery.ts` |

Vite loads `.env` from the **repo root** (see `nmac-crm-frontend/vite.config.ts`: `envDir: path.resolve(import.meta.dirname, '..')`).

---

## Search tips (to find usages in code)

- **API:** `settings.<NAME>` → grep for `settings.` in `nmac-crm-api/`.
- **Config definition:** all API vars are on `Settings` in `nmac-crm-api/app/config.py`.
- **Frontend:** `import.meta.env.VITE_` in `nmac-crm-frontend/`.

---

## Minimal `.env` to run locally (API + Redis + frontend)

```env
# Core (required)
SECRET_KEY=change-me-access-secret
REFRESH_SECRET_KEY=change-me-refresh-secret
REDIS_URL=redis://localhost:6379/0
DB_ENGINE=sqlite
DB_NAME=db.sqlite3

# Optional but useful
DEBUG=true
ENV=development
BASE_URL=http://localhost:8000/

# Frontend
VITE_API_BASE_URL=http://localhost:8000
```

Leave email, SMS, Twilio, and YouTube blank until you need those features.
