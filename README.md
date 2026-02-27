# NMAC CRM

CRM application consisting of a FastAPI backend and a React frontend.

## Repository structure

```
nmac-crm/
├── nmac-crm-api/      # Backend (FastAPI, Python 3.12)
├── nmac-crm-frontend/ # Frontend (React, TypeScript, Vite)
└── README.md          # This file
```

## Quick start

### Backend (API)

```bash
cd nmac-crm-api
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# Configure .env (see nmac-crm-api/README.md)
aerich init-db && aerich migrate && aerich upgrade
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd nmac-crm-frontend
npm install
# Set VITE_API_BASE_URL in .env (default: http://localhost:8000)
npm run dev
```
(Optional: run `nvm use` for Node 20; see .nvmrc.)

- API: http://localhost:8000  
- Frontend: http://localhost:5173  

**Env:** One **`.env`** at the repo root (`nmac-crm/.env`) is used by both the API and the frontend. Copy from **`.env.example`** and fill in as needed.

See `nmac-crm-api/README.md` and `nmac-crm-frontend/README.txt` for full setup.
