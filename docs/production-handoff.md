# Production Handoff

This document summarizes what is ready for deployment and what still requires dashboard access.

## Repository

```text
https://github.com/sridharmekala/SMARTED-AI-Learning-Platform
```

Current milestone:

```text
v0.1.0 - Full-Stack MVP
```

## Ready

- Backend source, configuration, and Dockerfile are committed.
- Frontend Vite app and Vercel rewrite configuration are committed.
- Render Blueprint is available at the repository root.
- CI runs backend tests and frontend builds on pushes and pull requests.
- Environment examples are available in `.env.example` and `frontend/.env.production.example`.
- Documentation is available under `docs/`.

## Required Dashboard Actions

1. Create or connect a managed MySQL database.
2. Deploy the backend using Render Blueprint from `render.yaml`.
3. Set backend secrets:

```bash
DB_HOST=host
DB_PORT=3306
DB_NAME=database-name
DB_USE_SSL=true
DB_USERNAME=database-user
DB_PASSWORD=database-password
JWT_SECRET=strong-random-secret
NVIDIA_API_KEY=nvapi-your-key
ADMIN_SEED_PASSWORD=temporary-admin-password
```

Rotate or remove the seeded admin password after creating a permanent admin process.

4. Deploy the frontend from the `frontend` root directory.
5. Set frontend environment:

```bash
VITE_API_BASE_URL=https://your-backend-domain.onrender.com
```

6. Update backend CORS after the frontend URL is known:

```bash
CORS_ALLOWED_ORIGIN_PATTERNS=https://your-frontend-domain.vercel.app
```

7. Redeploy backend and verify `/health`.

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
