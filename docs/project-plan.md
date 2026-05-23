# SMARTED AI Learning Platform - Project Plan

## Goal

Build a full-stack AI-based personalized learning platform with student learning flows, admin management tools, progress tracking, quizzes, certificates, notifications, saved topics, and chatbot support.

## Version Control Workflow

After every completed stage:

1. Run the relevant backend and frontend checks.
2. Add screenshots after major UI updates.
3. Commit with the required stage message.
4. Push to GitHub.

## Commit Message Pattern

- `Stage 1: Project Planning Completed`
- `Stage 2: Spring Boot Setup Added`
- `Stage 3: Database Models Added`
- `Stage 4: JWT Authentication Implemented`
- `Stage 5: Learning Module Added`
- `Stage X Completed`

## Repository Structure

```text
SMARTED-AI-Learning-Platform/
├── backend/
├── frontend/
├── screenshots/
├── docs/
├── README.md
└── .gitignore
```

## Security Rules

- Do not commit real passwords, JWT secrets, API keys, or database credentials.
- Use environment variables for local and production secrets.
- Keep `.env` files ignored and commit only `.env.example`.

