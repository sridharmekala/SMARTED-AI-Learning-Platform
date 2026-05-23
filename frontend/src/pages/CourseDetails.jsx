import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiAward, FiBookmark, FiBookOpen, FiCheckCircle } from 'react-icons/fi';
import EmptyState from '../components/ui/EmptyState.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { getCourseProgress } from '../services/progressService';
import { getSavedTopics, removeSavedTopic, saveTopic } from '../services/savedTopicService';

function CourseDetails() {
  const { courseId } = useParams();
  const [progress, setProgress] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [savingBookmarkId, setSavingBookmarkId] = useState(null);

  useEffect(() => {
    async function loadCourse() {
      try {
        const [progressData, savedData] = await Promise.all([getCourseProgress(courseId), getSavedTopics()]);
        setProgress(progressData);
        setSavedIds(new Set(savedData.map((topic) => topic.topicId)));
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [courseId]);

  if (loading) {
    return <LoadingSpinner label="Loading course..." />;
  }

  const topics = [...progress.completedTopics, ...progress.pendingTopics];

  async function toggleSaved(topicId) {
    setSavingBookmarkId(topicId);

    try {
      if (savedIds.has(topicId)) {
        await removeSavedTopic(topicId);
        setSavedIds((current) => {
          const next = new Set(current);
          next.delete(topicId);
          return next;
        });
        toast.success('Topic removed from saved list');
      } else {
        await saveTopic(topicId);
        setSavedIds((current) => new Set(current).add(topicId));
        toast.success('Topic saved for later');
      }
    } catch (err) {
      toast.error(err.response?.data || 'Unable to update saved topic.');
    } finally {
      setSavingBookmarkId(null);
    }
  }

  return (
    <div className="page-stack">
      <section className="hero-banner compact">
        <div>
          <span className="eyebrow">Course progress</span>
          <h1>{progress.courseName} Progress</h1>
          <p>{progress.completedCount} completed, {progress.pendingCount} pending, {progress.totalTopics} total topics.</p>
          <div className="progress-summary">
            <div>
              <strong>{progress.progressPercentage}%</strong>
              <span>Course progress</span>
            </div>
            <div className="progress-track">
              <span style={{ width: `${progress.progressPercentage}%` }} />
            </div>
          </div>
          <div className="hero-actions">
            <Link className="secondary-link" to={`/courses/${courseId}/topics/completed`}>Completed Topics</Link>
            <Link className="secondary-link" to={`/courses/${courseId}/topics/pending`}>Pending Topics</Link>
            <Link className={progress.progressPercentage === 100 ? 'primary-link' : 'secondary-link'} to={`/courses/${courseId}/certificate`}>
              <FiAward aria-hidden="true" />
              {progress.progressPercentage === 100 ? 'Download Certificate' : 'Certificate'}
            </Link>
          </div>
        </div>
      </section>

      {topics.length === 0 ? (
        <EmptyState icon={<FiBookOpen />} title="No topics yet" message="Admin can add topics to this course." />
      ) : (
        <section className="topic-grid">
          {topics.map((topic) => {
            const isSaved = savedIds.has(topic.topicId);

            return (
            <article className="topic-card" key={topic.topicId}>
              <div className="topic-card-body">
                <div className="topic-card-top">
                  <div className="topic-icon"><FiBookOpen /></div>
                  <span className={`topic-status ${topic.status === 'COMPLETED' ? 'completed' : 'pending'}`}>
                    {topic.status === 'COMPLETED' ? <FiCheckCircle /> : <FiBookOpen />}
                    {topic.status === 'COMPLETED' ? 'Completed' : 'Pending'}
                  </span>
                </div>
                <h2>{topic.title}</h2>
                <p>{topic.description}</p>
                <div className="topic-meta">
                  <span>{topic.difficulty}</span>
                  <span>{topic.estimatedTimeMinutes} min</span>
                </div>
                <div className="topic-actions">
                  <button
                    className="secondary-button compact"
                    type="button"
                    onClick={() => toggleSaved(topic.topicId)}
                    disabled={savingBookmarkId === topic.topicId}
                  >
                    <FiBookmark aria-hidden="true" />
                    {savingBookmarkId === topic.topicId ? 'Saving...' : (isSaved ? 'Saved' : 'Save')}
                  </button>
                  <Link className="primary-link" to={`/topics/${topic.topicId}`}>Open Topic</Link>
                </div>
              </div>
            </article>
            );
          })}
        </section>
      )}
    </div>
  );
}

export default CourseDetails;
