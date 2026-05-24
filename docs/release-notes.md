# Release Notes

## v0.1.0 - Full-Stack MVP

Initial SMARTED AI Learning Platform milestone.

### Added

- Spring Boot backend with authentication, JWT security, student APIs, admin APIs, and MySQL persistence.
- React frontend with student dashboard, courses, topics, quizzes, progress, leaderboard, profile, certificates, notes, saved topics, notifications, and AI tutor screens.
- Admin dashboard for courses, topics, quizzes, modules, notes, students, progress, scores, and AI tools.
- NVIDIA NIM powered AI tutor configuration through environment variables.
- Documentation for planning, setup, API endpoints, database models, auth, learning, quiz, dashboard, admin, AI tutor, support features, profile, certificates, QA, screenshots, deployment, and live-link setup.
- GitHub Actions CI for backend tests and frontend production builds.
- Render backend blueprint, backend Dockerfile, Vercel SPA routing, and production environment examples.

### Verified

- Backend Maven tests pass.
- Frontend Vite production build passes.
- Local screenshots were captured for login, registration, and admin login pages.

### Known Follow-Ups

- Connect Render and Vercel dashboards to create public live URLs.
- Refresh screenshots after live deployment.
- Add release tags after deployment is confirmed.
- Continue monitoring production bundle size as more pages are added.
