import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiBookOpen, FiEdit3, FiExternalLink, FiTrash2 } from 'react-icons/fi';
import EmptyState from '../components/ui/EmptyState.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { deleteNote, getNotes } from '../services/noteService';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function loadNotes() {
      try {
        setNotes(await getNotes());
      } catch (err) {
        toast.error(err.response?.data || 'Unable to load notes.');
      } finally {
        setLoading(false);
      }
    }

    loadNotes();
  }, []);

  async function handleDelete(noteId) {
    setDeletingId(noteId);

    try {
      await deleteNote(noteId);
      setNotes((current) => current.filter((note) => note.id !== noteId));
      toast.success('Note deleted');
    } catch (err) {
      toast.error(err.response?.data || 'Unable to delete note.');
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading notes..." />;
  }

  return (
    <div className="page-stack">
      <section className="hero-banner compact">
        <div>
          <span className="eyebrow">Topic-wise revision</span>
          <h1>My Learning Notes</h1>
          <p>Review your personal notes grouped by the topic and course where you wrote them.</p>
          <div className="hero-actions">
            <Link className="secondary-link" to="/courses">
              <FiBookOpen aria-hidden="true" />
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {notes.length === 0 ? (
        <EmptyState
          icon={<FiEdit3 />}
          title="No notes yet"
          message="Open any topic and write your first revision note."
          action={<Link className="primary-link" to="/courses">Explore Courses</Link>}
        />
      ) : (
        <section className="notes-list">
          {notes.map((note) => (
            <article className="note-card panel" key={note.id}>
              <div>
                <span className="topic-status saved">
                  <FiEdit3 aria-hidden="true" />
                  Note
                </span>
                <h2>{note.topicTitle}</h2>
                <p>{note.content}</p>
                <div className="topic-meta">
                  <span>{note.courseName}</span>
                  {note.updatedAt && <span>Updated {new Date(note.updatedAt).toLocaleDateString()}</span>}
                </div>
              </div>

              <div className="topic-actions">
                <Link className="primary-link" to={`/topics/${note.topicId}`}>
                  <FiExternalLink aria-hidden="true" />
                  Open Topic
                </Link>
                <button
                  className="danger-button"
                  type="button"
                  onClick={() => handleDelete(note.id)}
                  disabled={deletingId === note.id}
                >
                  <FiTrash2 aria-hidden="true" />
                  {deletingId === note.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default Notes;
