import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiBookOpen, FiCheckCircle } from 'react-icons/fi';
import EmptyState from '../components/ui/EmptyState.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { getCourseTopics, getCourseTopicsById, markTopicCompleted } from '../services/progressService';

const statusCopy = {
  completed: {
    eyebrow: 'Completed modules',
    title: 'Completed Java Full Stack Topics',
    message: 'These are the modules you have already completed in the Java Full Stack Development course.'
  },
  pending: {
    eyebrow: 'Pending modules',
    title: 'Pending Java Full Stack Topics',
    message: 'These modules are still pending. New admin-added topics appear here automatically until you complete them.'
  },
  new: {
    eyebrow: 'New modules',
    title: 'New Java Full Stack Topics',
    message: 'These are the latest pending modules added to your Java Full Stack Development course.'
  }
};

function TopicStatusPage() {
  const { status } = useParams();
  const { courseId } = useParams();
  const normalizedStatus = ['completed', 'pending', 'new'].includes(status) ? status : 'pending';
  const copy = statusCopy[normalizedStatus];
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const emptyMessage = useMemo(() => {
    if (normalizedStatus === 'completed') {
      return 'No completed modules yet. Open a pending module and mark it completed.';
    }
    if (normalizedStatus === 'new') {
      return 'No new pending modules right now.';
    }
    return 'No pending modules. Nice work.';
  }, [normalizedStatus]);

  useEffect(() => {
    async function loadTopics() {
      try {
        const data = courseId ? await getCourseTopicsById(courseId, normalizedStatus) : await getCourseTopics(normalizedStatus);
        setTopics(data);
      } catch (err) {
        toast.error(err.response?.data || 'Unable to load course topics.');
      } finally {
        setLoading(false);
      }
    }

    loadTopics();
  }, [normalizedStatus]);

  async function completeTopic(topicId) {
    setSavingId(topicId);

    try {
      await markTopicCompleted(topicId);
      setTopics((current) => current.filter((topic) => topic.topicId !== topicId));
      toast.success('Module marked completed');
    } catch (err) {
      toast.error(err.response?.data || 'Unable to mark module completed.');
    } finally {
      setSavingId(null);
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading course topics..." />;
  }

  return (
    <div className="page-stack">
      <section className="hero-banner compact">
        <div>
          <span className="eyebrow">{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
          <p>{copy.message}</p>
          <div className="hero-actions">
            <Link className="secondary-link" to={courseId ? `/courses/${courseId}` : '/dashboard'}>
              <FiArrowLeft aria-hidden="true" />
              Back to Dashboard
            </Link>
            <Link className="primary-link" to="/topics">All Course Modules</Link>
          </div>
        </div>
      </section>

      {topics.length === 0 ? (
        <EmptyState icon={<FiBookOpen />} title="Nothing to show" message={emptyMessage} />
      ) : (
        <section className="status-topic-list">
          {topics.map((topic) => (
            <article className="status-topic-card panel" key={topic.topicId}>
              <div>
                <span className={`topic-status ${topic.status === 'COMPLETED' ? 'completed' : 'pending'}`}>
                  {topic.status === 'COMPLETED' ? <FiCheckCircle aria-hidden="true" /> : <FiBookOpen aria-hidden="true" />}
                  {topic.status === 'COMPLETED' ? 'Completed' : 'Pending'}
                </span>
                <h2>{topic.title}</h2>
                <p>{topic.description}</p>
                <div className="topic-meta">
                  <span>{topic.difficulty || 'Beginner'}</span>
                  <span>{topic.estimatedTimeMinutes || 45} min</span>
                  {topic.completedAt && <span>Completed {new Date(topic.completedAt).toLocaleDateString()}</span>}
                </div>
              </div>

              <div className="topic-actions">
                <Link className="secondary-link" to={`/topics/${topic.topicId}`}>View Module</Link>
                {topic.status !== 'COMPLETED' && (
                  <button className="primary-button" type="button" onClick={() => completeTopic(topic.topicId)} disabled={savingId === topic.topicId}>
                    {savingId === topic.topicId ? 'Saving...' : 'Mark as Completed'}
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default TopicStatusPage;
