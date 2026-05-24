# Final QA and Bug Fixes

This stage records the final local quality checks before README polish and deployment preparation.

## Static Review

Checked for:

- TODO/FIXME markers
- Debug statements such as `console.log` and `debugger`
- Old local password/API-key patterns
- Mojibake or replacement characters in source and docs
- Build artifacts and dependency folders being ignored by Git

Result: no blocking issues found.

## Build Checks

Backend:

```bash
cd backend
mvn test
```

Frontend:

```bash
cd frontend
npm.cmd run build
```

Current frontend note: Vite reports a large chunk warning. The production build still succeeds, and code splitting can be handled as a future optimization.

## Smoke-Test Scope

The staged backend smoke test covers:

- Health endpoint
- Admin login
- Student registration/login
- Student dashboard
- Course list and progress
- Quiz retrieval
- Saved topics
- Notes
- Notifications
- Profile
- Certificate state
- Admin course/student/question list endpoints

Temporary QA users are removed after verification through the admin API.

## Known Follow-Ups

- Add automated backend tests for services/controllers.
- Add frontend linting and component tests.
- Add code splitting for large frontend bundles.
- Add production deployment configuration.
- Add fresh screenshots for the final README.

