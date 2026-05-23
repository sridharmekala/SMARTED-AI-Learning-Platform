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
| `DB_URL` | MySQL JDBC connection URL | `jdbc:mysql://localhost:3306/smarted_db?...` |
| `DB_USERNAME` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | empty |
| `JWT_SECRET` | JWT signing secret | development placeholder |
| `JWT_EXPIRATION_MS` | JWT expiry time in milliseconds | `86400000` |
| `NVIDIA_API_KEY` | NVIDIA NIM API key for chatbot features | empty |
| `NVIDIA_MODEL` | Chat model name | `meta/llama-3.1-8b-instruct` |
| `NVIDIA_BASE_URL` | Chat completion endpoint | NVIDIA integrations endpoint |

Example PowerShell setup:

```powershell
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your-password"
$env:JWT_SECRET="replace-with-a-long-random-secret-at-least-32-characters"
```

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

