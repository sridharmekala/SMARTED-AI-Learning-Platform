# Stage Log

## Stage 1: Project Planning Completed

- Created the full-stack repository structure.
- Added README, docs, screenshots folder, `.gitignore`, and `.env.example`.
- Removed hardcoded local database password from source configuration.
- Confirmed frontend build and backend Maven test lifecycle.
- Pushed the initial `main` branch to GitHub.

## Stage 2: Spring Boot Setup Added

- Verified Spring Boot backend health endpoint at `http://localhost:8081/health`.
- Documented backend requirements, environment variables, run command, and test command.
- Confirmed backend uses environment variables for database, JWT, and AI provider configuration.

## Stage 3: Database Models Added

- Verified JPA entities for users, courses, topics, quiz questions, scores, saved topics, completed topics, notes, progress, and chat history.
- Verified Spring Data JPA repositories for model persistence and service-layer queries.
- Added database model documentation with ERD, table responsibilities, constraints, defaults, and repository coverage.

## Stage 4: JWT Authentication Implemented

- Verified JWT generation, validation, bearer-token filtering, BCrypt password hashing, and role-based route protection.
- Verified frontend token storage and protected route handling for student and admin scopes.
- Hardened JWT filtering so malformed or expired bearer tokens are treated as unauthenticated requests.
- Added authentication documentation with request examples, protected route rules, and environment variables.
