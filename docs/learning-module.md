# Learning Module

The learning module lets students browse courses and topics, study topic content, track completion, save topics, write notes, receive recommendations, and follow a daily study plan.

## Backend Components

| Area | Files |
| --- | --- |
| Course/topic progress | `LearningProgressController`, `LearningProgressService` |
| Topic browsing | `TopicController`, `TopicService` |
| Daily study plan | `DailyPlanController`, `DailyPlanService` |
| Recommendations | `RecommendationController`, `RecommendationService` |
| Saved topics | `SavedTopicController`, `SavedTopicService` |
| Notes | `NoteController`, `NoteService` |

## Frontend Components

| Area | Files |
| --- | --- |
| Course list | `Courses.jsx` |
| Course detail and progress | `CourseDetails.jsx` |
| Topic list | `Topics.jsx` |
| Topic study page | `TopicDetails.jsx` |
| Daily plan | `DailyPlan.jsx` |
| Saved topics | `SavedTopics.jsx` |
| Notes | `Notes.jsx` |

## Main Student Flow

1. Student logs in and receives a JWT.
2. Frontend calls `/courses` to show available courses and progress.
3. Student opens a course through `/courses/{courseId}/progress`.
4. Student studies topics through `/course/topics/{topicId}`.
5. Student marks a topic complete through `/course/topics/{topicId}/complete`.
6. Backend stores completion status in `user_topic_progress`.
7. Dashboard, course pages, recommendations, and daily plan update from the stored progress.

## Learning Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/courses` | List courses with student progress. |
| `GET` | `/courses/{courseId}` | Get one course with progress summary. |
| `GET` | `/courses/{courseId}/progress` | Get course progress, completed topics, pending topics, and new topics. |
| `GET` | `/courses/{courseId}/topics` | Get all topics for a course with status. |
| `GET` | `/courses/{courseId}/topics/completed` | Get completed topics for a course. |
| `GET` | `/courses/{courseId}/topics/pending` | Get pending topics for a course. |
| `GET` | `/course` | Get default course progress. |
| `GET` | `/course/topics` | Get default course topics with status. |
| `GET` | `/course/topics/{topicId}` | Get one topic with student status. |
| `POST` | `/course/topics/{topicId}/complete` | Mark a topic complete. |
| `GET` | `/daily-plan` | Generate a daily study plan. |
| `GET` | `/recommend` | Get topic recommendations. |
| `GET` | `/saved-topics` | Get saved topics. |
| `POST` | `/saved-topics/{topicId}` | Save a topic. |
| `DELETE` | `/saved-topics/{topicId}` | Remove a saved topic. |
| `GET` | `/notes/topics/{topicId}` | Get a note for one topic. |
| `POST` | `/notes/topics/{topicId}` | Save a note for one topic. |
| `PUT` | `/notes/{noteId}` | Update a note. |

## Progress Rules

- Topics are treated as `PENDING` until the student marks them complete.
- Completion creates or updates a `UserTopicProgress` row with `status = COMPLETED`.
- `completedAt` is populated when a topic becomes completed.
- Progress percentage is calculated from completed topics divided by total course topics.
- Daily plan chooses reading, quiz, and revision tasks from pending topics and recommendations.

## Verification Checklist

- Login returns a JWT.
- `/courses` returns at least one course.
- `/courses/{courseId}/progress` returns progress counts and topic arrays.
- `/daily-plan` returns up to three study tasks.
- Completing a topic updates progress counts.

