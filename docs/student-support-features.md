# Notes, Saved Topics, and Notifications

These student support features help learners revise efficiently, keep important modules close, and receive progress-based reminders.

## Backend Components

| Feature | Files |
| --- | --- |
| Notes | `NoteController`, `NoteService`, `StudentNote`, `StudentNoteRepository` |
| Saved topics | `SavedTopicController`, `SavedTopicService`, `SavedTopic`, `SavedTopicRepository` |
| Notifications | `NotificationController`, `NotificationService`, `NotificationResponse` |

## Frontend Components

| Feature | Files |
| --- | --- |
| Notes | `Notes.jsx`, `noteService.js`, topic note controls in `TopicDetails.jsx` |
| Saved topics | `SavedTopics.jsx`, `savedTopicService.js`, save buttons in topic/course pages |
| Notifications | `Notifications.jsx`, `notificationService.js` |

## Notes

Students can save one note per topic. Notes are private to the authenticated user.

Endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/notes` | List the student's notes, newest updated first. |
| `GET` | `/notes/topics/{topicId}` | Get the student's note for one topic. |
| `POST` | `/notes/topics/{topicId}` | Create or update the note for one topic. |
| `PUT` | `/notes/{noteId}` | Update a note by id. |
| `DELETE` | `/notes/topics/{topicId}` | Delete the note for one topic. |
| `DELETE` | `/notes/{noteId}` | Delete a note by id. |

Rules:

- Note content is required.
- Students can update and delete only their own notes.
- A `(user_id, topic_id)` unique constraint prevents duplicate notes for the same topic.

## Saved Topics

Students can bookmark topics for quick revision.

Endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/saved-topics` | List saved topics. |
| `POST` | `/saved-topics/{topicId}` | Save a topic. |
| `DELETE` | `/saved-topics/{topicId}` | Remove a saved topic. |
| `GET` | `/saved-topics/{topicId}/status` | Check whether a topic is saved. |

Rules:

- Saved topics are private to the authenticated user.
- Saving an already saved topic returns the existing saved record.
- A `(user_id, topic_id)` unique constraint prevents duplicate saved-topic rows.

## Notifications

Notifications are generated dynamically from learning progress and recommendations.

Notification types:

- `PENDING_TOPICS`
- `QUIZ_REMINDER`
- `WEAK_TOPIC`
- `CERTIFICATE_READY`
- `ALL_CAUGHT_UP`

Endpoint:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/notifications` | Return generated learning reminders for the authenticated user. |

## Verification Checklist

- Login returns a JWT.
- A note can be created, listed, updated, and deleted.
- A topic can be saved, listed, status-checked, and removed.
- Notifications return at least one useful reminder or all-caught-up message.
- Temporary verification users are removed after testing.

