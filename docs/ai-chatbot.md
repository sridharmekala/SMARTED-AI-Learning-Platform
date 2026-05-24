# AI Chatbot

The AI chatbot gives students a protected AI tutor for programming questions. It adapts the prompt to the student's current level and saves question/answer history for later review.

## Backend Components

| Area | Files |
| --- | --- |
| Chat API | `ChatController` |
| AI provider integration | `ChatService` |
| Chat persistence | `ChatHistory`, `ChatHistoryRepository` |
| Request/response DTOs | `ChatRequest`, `ChatResponse`, `ChatHistoryResponse` |

## Frontend Components

| Area | Files |
| --- | --- |
| Chat UI | `Chatbot.jsx` |
| Chat API client | `chatService.js` |
| Authenticated API transport | `api.js` |

## Provider

The backend is configured for NVIDIA NIM chat completions.

Environment variables:

| Variable | Purpose |
| --- | --- |
| `NVIDIA_API_KEY` | API key used to call NVIDIA NIM. |
| `NVIDIA_MODEL` | Model name. Default: `meta/llama-3.1-8b-instruct`. |
| `NVIDIA_BASE_URL` | Chat completions endpoint. |

`OPENAI_API_KEY` is accepted as a fallback only for local compatibility, but `NVIDIA_API_KEY` is preferred.

## Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/chat` | Send a student question to the AI tutor. |
| `GET` | `/chat/history` | Get saved chat history for the authenticated user. |
| `DELETE` | `/chat/history` | Clear saved chat history for the authenticated user. |

## Chat Flow

1. Student logs in and receives a JWT.
2. Frontend loads previous chat history from `/chat/history`.
3. Student sends a message to `/chat`.
4. Backend validates the message and API-key configuration.
5. Backend builds a tutor prompt using the student's current level.
6. Backend calls NVIDIA NIM.
7. Backend saves the question, answer, level, model, and timestamp.
8. Frontend renders the assistant reply and model metadata.

## Request Example

```http
POST /chat
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "message": "Explain Spring Boot dependency injection simply."
}
```

## Response Example

```json
{
  "reply": "Dependency injection means Spring creates and gives objects to your classes...",
  "level": "Beginner",
  "model": "meta/llama-3.1-8b-instruct"
}
```

## Error Handling

- Empty messages return `400 Bad Request`.
- Missing `NVIDIA_API_KEY` returns `503 Service Unavailable`.
- Invalid or missing JWTs are rejected by the protected route rules.

## Verification Checklist

- Login returns a JWT.
- `/chat/history` returns the user's saved history.
- `/chat` rejects empty messages.
- `/chat` returns a clear service-unavailable message when the NVIDIA key is not configured.
- `/chat/history` can be cleared for the authenticated user.

