# Profile and Certificates

Profile and certificate features let students manage account details and download course completion certificates after finishing every topic in a course.

## Backend Components

| Feature | Files |
| --- | --- |
| Profile API | `ProfileController`, `ProfileService` |
| Certificate API | `CertificateController`, `CertificateService` |
| Profile DTOs | `ProfileResponse`, `ProfileUpdateRequest`, `AuthResponse` |
| Certificate DTO | `CertificateResponse` |

## Frontend Components

| Feature | Files |
| --- | --- |
| Profile page | `Profile.jsx` |
| Certificate page | `Certificate.jsx` |
| Profile API client | `profileService.js` |
| Certificate API client | `certificateService.js` |

## Profile Flow

1. Student opens profile.
2. Frontend calls `GET /profile`.
3. Student updates name/email and optionally password.
4. Frontend calls `PUT /profile`.
5. Backend validates ownership, email uniqueness, and password rules.
6. Backend returns a refreshed `AuthResponse` with a new JWT.
7. Frontend saves the updated auth data.

## Certificate Flow

1. Student opens a course certificate page.
2. Frontend calls `GET /courses/{courseId}/certificate`.
3. Backend checks course progress through `LearningProgressService`.
4. Certificate unlocks only when completed topics equal total topics.
5. Frontend renders the certificate preview.
6. Student downloads a PDF generated with `jsPDF`.

## Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/profile` | Get authenticated student profile. |
| `PUT` | `/profile` | Update name/email and optionally password. |
| `GET` | `/courses/{courseId}/certificate` | Get certificate eligibility and metadata. |

## Profile Rules

- Name is required.
- Email is required and must be unique.
- Current password is required when changing password.
- New password must be at least 6 characters.
- Passwords are stored with BCrypt.
- A new JWT is returned after profile updates.

## Certificate Rules

- Course must exist.
- Course must have at least one topic.
- Student must complete every topic in the course.
- Completion date is based on the latest completed topic timestamp.
- Locked certificates return progress details and a helpful message.

## Verification Checklist

- Login returns a JWT.
- `/profile` returns current user details.
- `/profile` updates name/email and returns a fresh token.
- `/courses/{courseId}/certificate` returns locked state before 100% completion.
- Completing every course topic unlocks the certificate.

