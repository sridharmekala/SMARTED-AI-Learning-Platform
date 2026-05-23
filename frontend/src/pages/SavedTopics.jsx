import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiBookmark, FiBookOpen, FiExternalLink, FiTrash2 } from 'react-icons/fi';
import EmptyState from '../components/ui/EmptyState.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { getSavedTopics, removeSavedTopic } from '../services/savedTopicService';

function SavedTopics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    async function loadSavedTopics() {
      try {
        setTopics(await getSavedTopics());
      } catch (err) {
        toast.error(err.response?.data || 'Unable to load saved topics.');
      } finally {
        setLoading(false);
      }
    }

    loadSavedTopics();
  }, []);

  async function handleRemove(topicId) {
    setRemovingId(topicId);

    try {
      await removeSavedTopic(topicId);
      setTopics((current) => current.filter((topic) => topic.topicId !== topicId));
      toast.success('Topic removed from saved list');
    } catch (err) {
      toast.error(err.response?.data || 'Unable to remove saved topic.');
    } finally {
      setRemovingId(null);
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading saved topics..." />;
  }

  return (
    <div className="page-stack">
      <section className="hero-banner compact">
        <div>
          <span className="eyebrow">Saved topics</span>
          <h1>Your Saved Learning Topics</h1>
          <p>Keep important topics here so you can return to them quickly while revising.</p>
          <div className="hero-actions">
            <Link className="secondary-link" to="/courses">
              <FiBookOpen aria-hidden="true" />
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {topics.length === 0 ? (
        <EmptyState
          icon={<FiBookmark />}
          title="No saved topics yet"
          message="Open any topic and save it for quick revision later."
          action={<Link className="primary-link" to="/courses">Explore Courses</Link>}
        />
      ) : (
        <section className="status-topic-list">
          {topics.map((topic) => (
            <article className="status-topic-card panel" key={topic.topicId}>
              <div>
                <span className="topic-status saved">
                  <FiBookmark aria-hidden="true" />
                  Saved
                </span>
                <h2>{topic.title}</h2>
                <p>{topic.description}</p>
                <div className="topic-meta">
                  <span>{topic.courseName}</span>
                  <span>{topic.difficulty || 'Beginner'}</span>
                  <span>{topic.estimatedTimeMinutes || 45} min</span>
                  {topic.savedAt && <span>Saved {new Date(topic.savedAt).toLocaleDateString()}</span>}
                </div>
              </div>

              <div className="topic-actions">
                <Link className="primary-link" to={`/topics/${topic.topicId}`}>
                  <FiExternalLink aria-hidden="true" />
                  Open Topic
                </Link>
                <button
                  className="danger-button"
                  type="button"
                  onClick={() => handleRemove(topic.topicId)}
                  disabled={removingId === topic.topicId}
                >
                  <FiTrash2 aria-hidden="true" />
                  {removingId === topic.topicId ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default SavedTopics;
