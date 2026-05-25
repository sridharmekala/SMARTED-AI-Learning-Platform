# Production Handoff

This document summarizes the live deployment and remaining dashboard maintenance tasks.

## Repository

```text
https://github.com/sridharmekala/SMARTED-AI-Learning-Platform
```

Current milestone:

```text
v0.1.0 - Full-Stack MVP
```

Live URLs:

```text
Frontend: https://smarted-ai-learning-platform.vercel.app/
Backend: https://smarted-ai-learning-platform.onrender.com
Backend health: https://smarted-ai-learning-platform.onrender.com/health
```

## Ready

- Backend source, configuration, and Dockerfile are committed.
- Frontend Vite app and Vercel rewrite configuration are committed.
- Render Blueprint is available at the repository root.
- CI runs backend tests and frontend builds on pushes and pull requests.
- Environment examples are available in `.env.example` and `frontend/.env.production.example`.
- Documentation is available under `docs/`.

## Dashboard Maintenance

Backend and frontend are deployed. Keep these backend secrets available in Render:

```bash
DB_HOST=host
DB_PORT=3306
DB_NAME=database-name
DB_USE_SSL=true
DB_USERNAME=database-user
DB_PASSWORD=database-password
MYSQL_ADDON_HOST=clever-cloud-host
MYSQL_ADDON_PORT=3306
MYSQL_ADDON_DB=clever-cloud-db-name
MYSQL_ADDON_USER=clever-cloud-user
MYSQL_ADDON_PASSWORD=clever-cloud-password
DB_POOL_MAX_SIZE=2
DB_POOL_MIN_IDLE=0
JWT_SECRET=strong-random-secret
NVIDIA_API_KEY=nvapi-your-key
ADMIN_SEED_PASSWORD=temporary-admin-password
```

Rotate or remove the seeded admin password after creating a permanent admin process.

Frontend environment:

```bash
VITE_API_BASE_URL=https://smarted-ai-learning-platform.onrender.com
```

Backend CORS:

```bash
CORS_ALLOWED_ORIGIN_PATTERNS=https://smarted-ai-learning-platform.vercel.app,https://*.vercel.app
```

Redeploy backend after rotating secrets or changing CORS.

## Acceptance Checks

- Backend `/health` returns `OK`.
- Student registration creates an account.
- Student login reaches dashboard.
- Admin login reaches admin overview.
- Quiz flow can submit answers.
- Certificate page can generate a PDF for eligible progress.
- AI tutor responds when `NVIDIA_API_KEY` is configured.

## Release Tag

Use the Git tag below for the first MVP release:

```bash
v0.1.0
```
