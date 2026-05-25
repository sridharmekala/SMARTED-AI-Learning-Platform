# Backend Setup

The SMARTED backend is a Spring Boot application located in `backend/`.

## Requirements

- Java 21
- Maven
- MySQL

## Configuration

Use environment variables for local secrets. Do not commit real passwords, JWT secrets, or API keys.

| Variable | Purpose | Default |
| --- | --- | --- |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_NAME` | MySQL database name | `smarted_db` |
| `DB_USE_SSL` | Enables SSL in the generated JDBC URL | `false` |
| `DB_USERNAME` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | empty |
| `MYSQL_ADDON_HOST` | Clever Cloud MySQL host, preferred when set | empty |
| `MYSQL_ADDON_PORT` | Clever Cloud MySQL port, preferred when set | empty |
| `MYSQL_ADDON_DB` | Clever Cloud MySQL database name, preferred when set | empty |
| `MYSQL_ADDON_USER` | Clever Cloud MySQL username, preferred when set | empty |
| `MYSQL_ADDON_PASSWORD` | Clever Cloud MySQL password, preferred when set | empty |
| `JWT_SECRET` | JWT signing secret | development placeholder |
| `JWT_EXPIRATION_MS` | JWT expiry time in milliseconds | `86400000` |
| `ADMIN_SEED_ENABLED` | Enables seeded admin creation | `true` |
| `ADMIN_SEED_NAME` | Seeded admin display name | `SMARTED Admin` |
| `ADMIN_SEED_EMAIL` | Seeded admin email | `admin@smarted.com` |
| `ADMIN_SEED_PASSWORD` | Temporary seeded admin password | empty, admin is not created |
| `NVIDIA_API_KEY` | NVIDIA NIM API key for chatbot features | empty |
| `NVIDIA_MODEL` | Chat model name | `meta/llama-3.1-8b-instruct` |
| `NVIDIA_BASE_URL` | Chat completion endpoint | NVIDIA integrations endpoint |

Example PowerShell setup:

```powershell
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your-password"
$env:JWT_SECRET="replace-with-a-long-random-secret-at-least-32-characters"
$env:ADMIN_SEED_PASSWORD="replace-with-a-temporary-admin-password"
```

For Clever Cloud, you can paste the provided `MYSQL_ADDON_HOST`, `MYSQL_ADDON_PORT`, `MYSQL_ADDON_DB`, `MYSQL_ADDON_USER`, and `MYSQL_ADDON_PASSWORD` variables directly into Render. The backend prefers those values when present and falls back to the generic `DB_*` values otherwise. If an old `DB_URL` variable exists in Render from a previous deploy attempt, remove it.

If `ADMIN_SEED_PASSWORD` is empty, the backend will not create a new default admin account. Existing seeded admin users keep their admin role.

## Run Locally

```bash
cd backend
mvn spring-boot:run
```

The backend starts on:

```text
http://localhost:8081
```

## Verify

```text
GET http://localhost:8081/health
```

Expected response:

```text
OK
```

## Test

```bash
cd backend
mvn test
```
