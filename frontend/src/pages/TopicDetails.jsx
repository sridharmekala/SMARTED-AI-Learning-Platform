import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiBookmark, FiBookOpen, FiCheckCircle, FiClipboard, FiEdit3, FiTrash2 } from 'react-icons/fi';
import EmptyState from '../components/ui/EmptyState.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { getTopicById } from '../services/topicService';
import { getProgress, markTopicCompleted } from '../services/progressService';
import { getSavedTopicStatus, removeSavedTopic, saveTopic } from '../services/savedTopicService';
import { deleteTopicNote, getTopicNote, saveTopicNote, updateNote } from '../services/noteService';

function TopicDetails() {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [progress, setProgress] = useState(null);
  const [note, setNote] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingBookmark, setSavingBookmark] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [deletingNote, setDeletingNote] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadTopic() {
      try {
        const [data, progressData, savedStatus] = await Promise.all([
          getTopicById(id),
          getProgress(),
          getSavedTopicStatus(id)
        ]);
        const noteData = await getTopicNote(id);
        setTopic(data);
        setProgress(progressData);
        setSaved(savedStatus);
        setNote(noteData);
        setNoteContent(noteData?.content || '');
      } catch (err) {
        setError('Unable to load this topic.');
      } finally {
        setLoading(false);
      }
    }

    loadTopic();
  }, [id]);

  async function handleMarkCompleted() {
    setSaving(true);

    try {
      const data = await markTopicCompleted(topic.id);
      setProgress(data);
      toast.success('Topic marked as completed');
    } catch (err) {
      toast.error(err.response?.data || 'Unable to mark topic completed');
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveNote(event) {
    event.preventDefault();

    if (!noteContent.trim()) {
      toast.error('Write a note before saving.');
      return;
    }

    setSavingNote(true);

    try {
      const savedNote = note?.id
        ? await updateNote(note.id, noteContent)
        : await saveTopicNote(topic.id, noteContent);
      setNote(savedNote);
      setNoteContent(savedNote.content);
      toast.success(note?.id ? 'Note updated' : 'Note saved');
    } catch (err) {
      toast.error(err.response?.data || 'Unable to save note.');
    } finally {
      setSavingNote(false);
    }
  }

  async function handleDeleteNote() {
    setDeletingNote(true);

    try {
      await deleteTopicNote(topic.id);
      setNote(null);
      setNoteContent('');
      toast.success('Note deleted');
    } catch (err) {
      toast.error(err.response?.data || 'Unable to delete note.');
    } finally {
      setDeletingNote(false);
    }
  }

  async function handleBookmark() {
    setSavingBookmark(true);

    try {
      if (saved) {
        await removeSavedTopic(topic.id);
        setSaved(false);
        toast.success('Topic removed from saved list');
      } else {
        await saveTopic(topic.id);
        setSaved(true);
        toast.success('Topic saved for later');
      }
    } catch (err) {
      toast.error(err.response?.data || 'Unable to update saved topic.');
    } finally {
      setSavingBookmark(false);
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading topic..." />;
  }

  if (error) {
    return (
      <EmptyState
        icon={<FiBookOpen />}
        title="Topic unavailable"
        message={error}
        action={<Link className="secondary-link" to="/topics">Back to topics</Link>}
      />
    );
  }

  const isCompleted = topic.status === 'COMPLETED'
    || progress?.completedTopics?.some((item) => item.topicId === topic.id);

  return (
    <section className="panel learning-content">
      <div className="topic-detail-hero">
        <div>
          <span className="eyebrow">Java Full Stack Module</span>
          <h1>{topic.title}</h1>
          <p>{topic.description}</p>
        </div>
        <div className="topic-detail-actions">
          <button className="secondary-button" type="button" onClick={handleBookmark} disabled={savingBookmark}>
            <FiBookmark aria-hidden="true" />
            {savingBookmark ? 'Saving...' : (saved ? 'Saved Topic' : 'Save Topic')}
          </button>
          <button className="secondary-button" type="button" onClick={handleMarkCompleted} disabled={saving || isCompleted}>
            <FiCheckCircle aria-hidden="true" />
            {isCompleted ? 'Module Completed' : (saving ? 'Saving...' : 'Mark Module Completed')}
          </button>
          <Link className="primary-link" to={`/quiz/${topic.id}`}>
            <FiClipboard aria-hidden="true" />
            Take Quiz
          </Link>
        </div>
      </div>

      <div className="content-box">
        <p>{topic.content}</p>
      </div>

      <section className="notes-panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Topic notes</span>
            <h2>My Notes</h2>
          </div>
          {note?.updatedAt && <span className="note-timestamp">Updated {new Date(note.updatedAt).toLocaleString()}</span>}
        </div>

        <form className="notes-form" onSubmit={handleSaveNote}>
          <label htmlFor="topic-note">Write your revision notes for this topic</label>
          <textarea
            id="topic-note"
            value={noteContent}
            onChange={(event) => setNoteContent(event.target.value)}
            placeholder="Example: Key points, doubts, formulas, interview questions..."
            rows={7}
          />

          <div className="topic-actions">
            <button className="primary-button" type="submit" disabled={savingNote}>
              <FiEdit3 aria-hidden="true" />
              {savingNote ? 'Saving...' : (note?.id ? 'Update Note' : 'Save Note')}
            </button>
            {note?.id && (
              <button className="danger-button" type="button" onClick={handleDeleteNote} disabled={deletingNote}>
                <FiTrash2 aria-hidden="true" />
                {deletingNote ? 'Deleting...' : 'Delete Note'}
              </button>
            )}
          </div>
        </form>
      </section>

      <Link className="secondary-link fit-content" to="/topics">
        <FiArrowLeft aria-hidden="true" />
        Back to topics
      </Link>
    </section>
  );
}

export default TopicDetails;
