# Dashboard and Progress

The dashboard and progress module gives students a central view of course completion, quiz history, recommendations, rankings, and topic status.

## Backend Components

| Area | Files |
| --- | --- |
| Dashboard API | `DashboardController`, `DashboardService` |
| Course progress API | `LearningProgressController`, `LearningProgressService` |
| Leaderboard API | `LeaderboardController`, `LeaderboardService` |
| Score history | `Score`, `ScoreRepository` |
| Topic progress | `UserTopicProgress`, `UserTopicProgressRepository` |

## Frontend Components

| Area | Files |
| --- | --- |
| Student dashboard | `Dashboard.jsx` |
| Topic status lists | `TopicStatusPage.jsx` |
| Leaderboard | `Leaderboard.jsx` |
| Score chart | `ScoreChart.jsx` |
| Dashboard API client | `dashboardService.js` |
| Progress API client | `progressService.js` |
| Leaderboard API client | `leaderboardService.js` |

## Dashboard Data

`GET /dashboard` returns:

- Student identity and current level
- Total, completed, pending, and new topic counts
- Course progress percentage
- Quiz score history
- Recommended topics

## Progress Data

Progress is calculated from `user_topic_progress` records:

- A topic is `PENDING` when no progress row exists or when status is not `COMPLETED`.
- A topic is `COMPLETED` when the progress row has `status = COMPLETED`.
- Progress percentage is rounded from `completedTopics / totalTopics * 100`.
- The newest pending topics are exposed as `newTopics`.

## Leaderboard Data

`GET /leaderboard` ranks non-admin students by:

1. Average quiz score
2. Best quiz score
3. Total attempts
4. Student name

Only students with at least one quiz attempt are shown.

## Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/dashboard` | Student dashboard summary. |
| `GET` | `/progress` | Default course progress. |
| `GET` | `/course` | Default course progress alias. |
| `GET` | `/course/topics/completed` | Completed default-course topics. |
| `GET` | `/course/topics/pending` | Pending default-course topics. |
| `GET` | `/course/topics/new` | New pending default-course topics. |
| `POST` | `/course/topics/{topicId}/complete` | Mark a topic complete. |
| `GET` | `/leaderboard` | Student ranking by quiz performance. |

## Verification Checklist

- Login returns a JWT.
- `/dashboard` returns progress counts and score history.
- `/course/topics/completed` and `/course/topics/pending` return status-filtered topic lists.
- Marking a topic complete changes dashboard counts.
- `/leaderboard` returns ranking entries after students attempt quizzes.

