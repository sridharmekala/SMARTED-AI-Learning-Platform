# Deployment

SMARTED can be deployed as a split full-stack application:

- Frontend: Vercel, Netlify, or another static React host.
- Backend: Render, Railway, Fly.io, or another Java 21 Spring Boot host.
- Database: Managed MySQL, such as Railway MySQL, PlanetScale, Aiven, or AWS RDS.

Current live deployment:

- Frontend: https://smarted-ai-learning-platform.vercel.app/
- Backend: https://smarted-ai-learning-platform.onrender.com
- Health check: https://smarted-ai-learning-platform.onrender.com/health

Stage 15 adds a Render Blueprint, backend Dockerfile, GitHub Actions CI, and frontend production environment example. See `docs/live-link-setup.md` for the final dashboard steps.

## Backend

Build command:

```bash
mvn clean package
```

Start command:

```bash
java -jar target/smarted-backend-0.0.1-SNAPSHOT.jar
```

Docker deployment is also supported through `backend/Dockerfile` and the root `render.yaml` Blueprint.

Required environment variables:

```bash
DB_HOST=host
DB_PORT=3306
DB_NAME=smarted_db
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
JWT_SECRET=replace-with-a-long-random-secret-at-least-32-characters
CORS_ALLOWED_ORIGIN_PATTERNS=https://your-frontend-domain.vercel.app
ADMIN_SEED_PASSWORD=replace-with-a-temporary-admin-password
```

Optional AI environment variables:

```bash
NVIDIA_API_KEY=nvapi-your-key
NVIDIA_MODEL=meta/llama-3.1-8b-instruct
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1/chat/completions
```

The backend reads the hosting provider `PORT` value when present and falls back to `8081` locally.

## Frontend

Install command:

```bash
npm install
```

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

Required environment variable:

```bash
VITE_API_BASE_URL=https://your-backend-domain.example
```

The frontend includes `vercel.json` so direct visits to React routes return `index.html`.

Copy `frontend/.env.production.example` into the hosting provider environment settings and replace the backend URL.

## Release Checklist

- Set all secrets as host environment variables.
- Confirm no API keys are committed to source control.
- Confirm backend `/health` returns `OK`.
- Confirm frontend login, registration, dashboard, and admin routes load after deployment.
- Add production frontend origin to `CORS_ALLOWED_ORIGIN_PATTERNS`.
- Capture fresh screenshots after the deployed UI is verified.
