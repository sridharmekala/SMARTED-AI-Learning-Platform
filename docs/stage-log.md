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

## Stage 5: Learning Module Added

- Verified course, topic, topic completion, recommendation, saved-topic, note, and daily-plan learning flows.
- Documented backend controllers/services, frontend pages/services, student flow, endpoints, and progress rules.
- Confirmed topic completion updates `user_topic_progress` and feeds progress percentage, dashboard, and daily plan data.

## Stage 6: Quiz Module Added

- Verified topic quiz retrieval, quiz submission, score persistence, and level calculation.
- Verified frontend quiz page and API client integration.
- Added quiz module documentation with flow, endpoints, validation rules, and verification checklist.

## Stage 7: Dashboard and Progress Added

- Verified dashboard, progress, topic status, and leaderboard backend services.
- Verified frontend dashboard, topic status pages, score chart, and leaderboard integration.
- Added dashboard/progress documentation with data rules, endpoints, ranking logic, and verification checklist.

## Stage 8: Admin Dashboard Added

- Verified admin-only backend endpoints for courses, topics, quiz questions, students, progress, and scores.
- Verified frontend admin route protection, admin layout/sidebar, overview page, and admin service integration.
- Added admin dashboard documentation with access control, endpoint list, data-safety rules, and verification checklist.

## Stage 9: AI Chatbot Added

- Verified protected chatbot endpoints for sending messages, loading history, and clearing history.
- Verified NVIDIA NIM configuration uses environment variables instead of committed API keys.
- Verified frontend AI tutor page and chat API client integration.
- Added AI chatbot documentation with provider configuration, endpoints, request/response examples, and error handling.

## Stage 10: Notes, Saved Topics, and Notifications Added

- Verified note creation, listing, updating, and deletion for authenticated students.
- Verified saved-topic creation, listing, status checks, duplicate handling, and removal.
- Verified generated learning notifications from progress and recommendation data.
- Added student support feature documentation with endpoints, rules, and verification checklist.

## Stage 11: Certificates and Profile Added

- Verified profile retrieval and update flow, including refreshed JWT responses after account changes.
- Verified certificate eligibility checks for locked and completed course states.
- Verified frontend profile editing and certificate PDF generation integration.
- Added profile and certificate documentation with flows, endpoints, rules, and verification checklist.

## Stage 12: Final QA and Bug Fixes

- Ran static QA checks for debug statements, TODOs, hardcoded secret patterns, encoding artifacts, and Git hygiene.
- Re-ran backend and frontend build checks.
- Smoke-tested key authenticated student and admin backend flows.
- Added final QA documentation with check scope, results, and known follow-ups.

## Stage 13: Screenshots and README Polish

- Captured updated student login, student registration, and admin login screenshots from the local frontend.
- Updated README screenshots to render preview images directly on GitHub.
- Added a compact documentation index and screenshot notes.
- Added screenshot documentation with capture notes and future protected-page screenshot follow-ups.

## Stage 14: Deployment Preparation

- Added deployment documentation for split frontend/backend hosting.
- Added backend Java runtime metadata for Java 21 hosting.
- Updated backend port and CORS configuration to use deployment environment variables.
- Added Vercel SPA rewrite configuration for frontend routes.

## Stage 15: Production Deployment Setup

- Added backend Dockerfile for cloud hosting.
- Added Render Blueprint configuration for backend deployment.
- Added GitHub Actions CI for backend tests and frontend production build.
- Added frontend production environment example.
- Added live-link setup documentation for Render and Vercel dashboard deployment.

## Stage 16: GitHub Project Polish

- Added bug report and feature request issue templates.
- Added pull request checklist for testing, screenshots, and documentation.
- Added release notes for the full-stack MVP milestone.
- Updated README documentation index and GitHub workflow notes.

## Stage 17: Frontend Performance Optimization

- Converted student and admin page routes to lazy-loaded chunks.
- Added a shared route loading fallback for page transitions.
- Reduced the initial frontend production bundle size.

## Stage 18: Release Handoff and Tagging

- Added changelog for the first full-stack MVP release.
- Added production handoff documentation for deployment owners.
- Updated README documentation index with release and handoff references.
- Prepared the repository for the `v0.1.0` release tag.

## Stage 19: Admin Seed Security Hardening

- Moved seeded admin credentials into environment-driven backend configuration.
- Prevented new default admin creation unless `ADMIN_SEED_PASSWORD` is set.
- Removed visible default admin credentials from the frontend login screen.
- Updated setup, deployment, production handoff, and release documentation.

## Stage 20: Clever Cloud MySQL Deployment Fix

- Added support for `DB_HOST`, `DB_PORT`, `DB_NAME`, and `DB_USE_SSL` database environment variables.
- Aligned backend datasource configuration with Clever Cloud-style Render environment variables.
- Updated Render Blueprint and deployment documentation for cloud MySQL credentials.

## Stage 21: Clever Cloud Add-on Variable Support

- Added direct support for Clever Cloud `MYSQL_ADDON_*` environment variables.
- Kept generic `DB_*` database variables as fallback values.
- Updated Render Blueprint and deployment documentation for Clever Cloud add-on credentials.
