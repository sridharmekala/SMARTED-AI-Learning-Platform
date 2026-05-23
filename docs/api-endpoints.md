# API Endpoints

Base URL for local development:

```text
http://localhost:8081
```

## Public

- `GET /`
- `GET /health`
- `POST /register`
- `POST /login`

## Student

- `GET /dashboard`
- `GET /daily-plan`
- `GET /topics`
- `GET /topics/{id}`
- `GET /course`
- `GET /courses`
- `GET /courses/{courseId}`
- `GET /courses/{courseId}/topics`
- `GET /courses/{courseId}/progress`
- `GET /courses/{courseId}/topics/completed`
- `GET /courses/{courseId}/topics/pending`
- `POST /topics/{topicId}/complete`
- `GET /quiz/{topicId}`
- `POST /quiz/submit`
- `GET /recommend`
- `GET /search`
- `GET /saved-topics`
- `POST /saved-topics/{topicId}`
- `DELETE /saved-topics/{topicId}`
- `GET /saved-topics/{topicId}/status`
- `GET /notes`
- `GET /notes/topics/{topicId}`
- `POST /notes/topics/{topicId}`
- `PUT /notes/{noteId}`
- `DELETE /notes/topics/{topicId}`
- `DELETE /notes/{noteId}`
- `GET /profile`
- `PUT /profile`
- `GET /notifications`
- `GET /leaderboard`
- `GET /courses/{courseId}/certificate`
- `POST /chat`
- `GET /chat/history`
- `DELETE /chat/history`

## Admin

- `GET /admin/courses`
- `POST /admin/courses`
- `PUT /admin/courses/{courseId}`
- `DELETE /admin/courses/{courseId}`
- `GET /admin/courses/{courseId}/topics`
- `POST /admin/courses/{courseId}/topics`
- `POST /admin/topics`
- `PUT /admin/topics/{topicId}`
- `DELETE /admin/topics/{topicId}`
- `GET /admin/quiz-questions`
- `GET /admin/topics/{topicId}/questions`
- `POST /admin/topics/{topicId}/questions`
- `POST /admin/quiz-questions`
- `PUT /admin/questions/{questionId}`
- `DELETE /admin/questions/{questionId}`
- `GET /admin/students`
- `POST /admin/students`
- `GET /admin/students/{studentId}`
- `PUT /admin/students/{studentId}`
- `DELETE /admin/students/{studentId}`
- `PUT /admin/students/{studentId}/reset-password`
- `GET /admin/students/{studentId}/progress`
- `GET /admin/students/{studentId}/scores`

