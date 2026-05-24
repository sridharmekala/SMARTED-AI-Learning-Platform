# Admin Dashboard

The admin dashboard gives administrators a protected workspace for managing SMARTED courses, topics, quiz questions, students, progress, scores, leaderboard data, and AI tooling entry points.

## Access Control

- Admin pages are protected by `AdminRoute.jsx`.
- Admin API routes are under `/admin/**`.
- Spring Security requires `ROLE_ADMIN` for all `/admin/**` backend routes.
- Admin login uses the same `/login` endpoint and stores the token in the admin auth scope.

## Backend Components

| Area | Files |
| --- | --- |
| Admin API | `AdminController` |
| Admin business logic | `AdminService` |
| Security rules | `SecurityConfig` |
| Course and topic data | `CourseRepository`, `TopicRepository` |
| Quiz question data | `QuizQuestionRepository` |
| Student data | `UserRepository`, `ScoreRepository`, progress repositories |

## Frontend Components

| Area | Files |
| --- | --- |
| Admin shell | `AdminLayout.jsx`, `AdminSidebar.jsx` |
| Admin overview | `AdminOverview.jsx` |
| Course management | `ManageCourses.jsx` |
| Topic/module management | `ManageTopics.jsx`, `ManageModules.jsx` |
| Quiz management | `ManageQuizzes.jsx` |
| Student management | `ManageStudents.jsx` |
| Admin leaderboard/profile/tools | `AdminLeaderboard.jsx`, `AdminProfile.jsx`, `AdminAITools.jsx` |
| API client | `adminService.js` |

## Admin Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/admin/courses` | List courses. |
| `POST` | `/admin/courses` | Create a course. |
| `PUT` | `/admin/courses/{courseId}` | Update a course. |
| `DELETE` | `/admin/courses/{courseId}` | Delete a course and related learning data. |
| `GET` | `/admin/courses/{courseId}/topics` | List topics for a course. |
| `POST` | `/admin/courses/{courseId}/topics` | Add a topic to a course. |
| `PUT` | `/admin/topics/{topicId}` | Update a topic. |
| `DELETE` | `/admin/topics/{topicId}` | Delete a topic and related quiz/progress data. |
| `GET` | `/admin/quiz-questions` | List quiz questions. |
| `POST` | `/admin/quiz-questions` | Create a quiz question. |
| `PUT` | `/admin/questions/{questionId}` | Update a quiz question. |
| `DELETE` | `/admin/questions/{questionId}` | Delete a quiz question. |
| `GET` | `/admin/students` | List students. |
| `POST` | `/admin/students` | Create a student account. |
| `GET` | `/admin/students/{studentId}` | View one student. |
| `PUT` | `/admin/students/{studentId}` | Update student profile fields. |
| `DELETE` | `/admin/students/{studentId}` | Delete a student and related data. |
| `PUT` | `/admin/students/{studentId}/reset-password` | Reset a student password. |
| `GET` | `/admin/students/{studentId}/progress` | View student course progress. |
| `GET` | `/admin/students/{studentId}/scores` | View student score history. |

## Data Safety

- Deleting a course removes related topics, quiz questions, scores, saved topics, notes, completed-topic records, and topic progress.
- Deleting a topic removes related quiz questions, scores, saved topics, notes, completed-topic records, and topic progress.
- Deleting a student removes related scores, saved topics, notes, progress, and chat history.
- Admin users cannot be managed through student-management endpoints.

## Verification Checklist

- Admin login returns a JWT with `role = ADMIN`.
- Student tokens cannot access `/admin/**`.
- Admin token can list courses, students, and quiz questions.
- Admin can create and delete a temporary course.
- Admin can create and delete a temporary student.

