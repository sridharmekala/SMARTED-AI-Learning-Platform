# Database Models

The backend uses Spring Data JPA entities in `backend/src/main/java/com/smarted/entity` and repository interfaces in `backend/src/main/java/com/smarted/repository`.

## Entity Relationship Diagram

```mermaid
erDiagram
    users ||--o{ scores : attempts
    users ||--o{ saved_topics : saves
    users ||--o{ completed_topics : completes
    users ||--o{ student_notes : writes
    users ||--o{ user_course_progress : enrolls
    users ||--o{ user_topic_progress : tracks
    users ||--o{ chat_history : asks

    courses ||--o{ topics : contains
    courses ||--o{ user_course_progress : tracks

    topics ||--o{ quiz_questions : has
    topics ||--o{ scores : receives
    topics ||--o{ saved_topics : appears_in
    topics ||--o{ completed_topics : appears_in
    topics ||--o{ student_notes : has
    topics ||--o{ user_topic_progress : tracks

    users {
        bigint id PK
        string name
        string email UK
        string password
        string level
        string role
        datetime created_at
    }

    courses {
        bigint id PK
        string name UK
        string description
    }

    topics {
        bigint id PK
        string title
        string description
        text content
        bigint course_id FK
        string difficulty
        int estimated_time_minutes
        datetime created_at
    }

    quiz_questions {
        bigint id PK
        bigint topic_id FK
        text question
        string option_a
        string option_b
        string option_c
        string option_d
        string correct_answer
    }

    scores {
        bigint id PK
        bigint user_id FK
        bigint topic_id FK
        int score
        string level
        datetime attempted_at
    }

    saved_topics {
        bigint id PK
        bigint user_id FK
        bigint topic_id FK
        datetime saved_at
    }

    completed_topics {
        bigint id PK
        bigint user_id FK
        bigint topic_id FK
        datetime completed_at
    }

    student_notes {
        bigint id PK
        bigint user_id FK
        bigint topic_id FK
        text content
        datetime created_at
        datetime updated_at
    }

    user_course_progress {
        bigint id PK
        bigint user_id FK
        bigint course_id FK
        string status
        datetime created_at
    }

    user_topic_progress {
        bigint id PK
        bigint user_id FK
        bigint topic_id FK
        string status
        datetime created_at
        datetime completed_at
    }

    chat_history {
        bigint id PK
        bigint user_id FK
        text question
        text answer
        string level
        string model
        datetime created_at
    }
```

## Tables

| Entity | Table | Purpose |
| --- | --- | --- |
| `User` | `users` | Stores student/admin accounts, roles, levels, and hashed passwords. |
| `Course` | `courses` | Stores course catalog records. |
| `Topic` | `topics` | Stores learning content, difficulty, estimated time, and course relationship. |
| `QuizQuestion` | `quiz_questions` | Stores multiple-choice questions for each topic. |
| `Score` | `scores` | Stores quiz attempts and score history. |
| `SavedTopic` | `saved_topics` | Stores each student's saved topics. |
| `CompletedTopic` | `completed_topics` | Stores completed topic records. |
| `StudentNote` | `student_notes` | Stores student notes per topic. |
| `UserCourseProgress` | `user_course_progress` | Tracks course enrollment/progress status. |
| `UserTopicProgress` | `user_topic_progress` | Tracks topic status and completion timestamps. |
| `ChatHistory` | `chat_history` | Stores user chatbot questions and answers. |

## Important Constraints

- `users.email` is unique.
- `courses.name` is unique.
- `saved_topics` has a unique `(user_id, topic_id)` pair.
- `completed_topics` has a unique `(user_id, topic_id)` pair.
- `student_notes` has a unique `(user_id, topic_id)` pair.
- `user_course_progress` has a unique `(user_id, course_id)` pair.
- `user_topic_progress` has a unique `(user_id, topic_id)` pair.

## Default Values

- New users default to `level = Beginner` and `role = STUDENT`.
- New topics default to `difficulty = Beginner` and `estimated_time_minutes = 45`.
- New topic progress rows default to `status = PENDING`.
- New course progress rows default to `status = ENROLLED`.
- Timestamp fields are set through JPA lifecycle callbacks such as `@PrePersist` and `@PreUpdate`.

## Repository Layer

Each entity has a Spring Data JPA repository for CRUD operations and feature-specific lookups:

- `UserRepository`
- `CourseRepository`
- `TopicRepository`
- `QuizQuestionRepository`
- `ScoreRepository`
- `SavedTopicRepository`
- `CompletedTopicRepository`
- `StudentNoteRepository`
- `UserCourseProgressRepository`
- `UserTopicProgressRepository`
- `ChatHistoryRepository`

