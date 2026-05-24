# Quiz Module

The quiz module lets students answer topic-based multiple-choice questions, submit attempts, receive a score, and update their learning level.

## Backend Components

| Area | Files |
| --- | --- |
| Quiz API | `QuizController` |
| Quiz scoring | `QuizService` |
| Quiz data | `QuizQuestion`, `QuizQuestionRepository` |
| Score history | `Score`, `ScoreRepository` |
| Level calculation | `RecommendationService` |

## Frontend Components

| Area | Files |
| --- | --- |
| Quiz page | `Quiz.jsx` |
| Quiz API client | `quizService.js` |
| Result level badge | `LevelBadge.jsx` |

## Main Flow

1. Student opens a topic quiz.
2. Frontend calls `GET /quiz/{topicId}`.
3. Backend returns questions and options without exposing the correct answer.
4. Student answers every question.
5. Frontend submits selected answers to `POST /quiz/submit`.
6. Backend compares answers with stored correct answers.
7. Backend saves a `Score` record.
8. Backend calculates the user's latest level:
   - `< 40`: `Beginner`
   - `40-70`: `Intermediate`
   - `> 70`: `Advanced`
9. Frontend displays score, correct answer count, total questions, and level.

## Endpoints

### Get Quiz Questions

```http
GET /quiz/{topicId}
Authorization: Bearer jwt-token
```

Response:

```json
[
  {
    "id": 1,
    "topicId": 1,
    "question": "Question text",
    "optionA": "Option A",
    "optionB": "Option B",
    "optionC": "Option C",
    "optionD": "Option D"
  }
]
```

### Submit Quiz

```http
POST /quiz/submit
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "topicId": 1,
  "answers": [
    {
      "questionId": 1,
      "selectedAnswer": "A"
    }
  ]
}
```

Response:

```json
{
  "topicId": 1,
  "totalQuestions": 5,
  "correctAnswers": 4,
  "score": 80,
  "level": "Advanced"
}
```

## Validation Rules

- Topic must exist.
- Topic must have quiz questions.
- Answers are required.
- Frontend requires every visible question to be answered before submitting.
- Submitted answers are normalized to uppercase before scoring.

## Verification Checklist

- Login returns a JWT.
- `GET /quiz/{topicId}` returns questions without `correctAnswer`.
- `POST /quiz/submit` returns score result.
- A score row is saved.
- User level updates based on the latest score.

