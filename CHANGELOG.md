# Changelog

All notable changes to SMARTED AI Learning Platform are documented here.

## v0.1.0 - Full-Stack MVP

### Added

- Spring Boot backend with JWT authentication, student features, admin APIs, AI tutor integration, and MySQL persistence.
- React frontend for student learning, quizzes, progress, certificates, notes, saved topics, notifications, profile, and AI tutor workflows.
- Admin dashboard for courses, topics, quizzes, exams, notes, students, progress, scores, leaderboard, profile, and AI tools.
- Documentation covering project planning, setup, API endpoints, database models, authentication, feature modules, QA, screenshots, deployment, and live-link setup.
- GitHub Actions CI for backend tests and frontend builds.
- Render backend deployment blueprint, backend Dockerfile, Vercel SPA routing, and production environment examples.
- GitHub issue templates and pull request checklist.
- Frontend route-level lazy loading to reduce the initial production bundle.

### Verified

- Backend `mvn test` passes.
- Frontend `npm run build` passes.
- Local preview smoke test passes for login, registration, and admin login routes.

### Pending Deployment Tasks

- Connect GitHub to Render and Vercel.
- Configure production database and secret environment variables.
- Verify deployed frontend/backend URLs.
- Refresh screenshots after the live UI is available.
