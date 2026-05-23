# JWT Authentication

The SMARTED backend uses stateless JWT authentication with Spring Security.

## Public Endpoints

- `POST /register`
- `POST /login`
- `GET /`
- `GET /health`
- `GET /topics/**`

## Protected Endpoints

- Student routes require a valid bearer token.
- Admin routes under `/admin/**` require a valid bearer token with `ROLE_ADMIN`.

## Register

```http
POST /register
Content-Type: application/json

{
  "name": "Student Name",
  "email": "student@example.com",
  "password": "password"
}
```

Successful response:

```json
{
  "token": "jwt-token",
  "userId": 1,
  "name": "Student Name",
  "email": "student@example.com",
  "level": "Beginner",
  "role": "STUDENT"
}
```

## Login

```http
POST /login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password"
}
```

Successful response has the same shape as registration.

## Authenticated Requests

Send the token in the `Authorization` header:

```http
Authorization: Bearer jwt-token
```

## Backend Components

- `SecurityConfig` configures stateless security, public routes, role checks, CORS, and password encoding.
- `JwtUtil` generates, parses, and validates JWTs.
- `JwtAuthenticationFilter` reads bearer tokens and populates the Spring Security context.
- `CustomUserDetailsService` loads users by email and maps user roles to Spring authorities.
- `AuthService` handles registration, login, BCrypt password hashing, and token creation.

## Frontend Components

- `authService.js` calls `/register` and `/login`.
- `api.js` attaches bearer tokens to protected API requests.
- `ProtectedRoute.jsx` protects student pages.
- `AdminRoute.jsx` protects admin pages.

## Environment Variables

- `JWT_SECRET` should be a long random value and must not be committed.
- `JWT_EXPIRATION_MS` controls token lifetime. The local default is `86400000` milliseconds.

