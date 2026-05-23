import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowRight, FiBookmark, FiBookOpen, FiCheckCircle, FiCode, FiDatabase } from 'react-icons/fi';
import EmptyState from '../components/ui/EmptyState.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { getTopics } from '../services/topicService';
import { getProgress } from '../services/progressService';
import { getSavedTopics, removeSavedTopic, saveTopic } from '../services/savedTopicService';
import javaImage from '../assets/images/topic-java.svg';
import databaseImage from '../assets/images/topic-database.svg';
import webImage from '../assets/images/topic-web.svg';

const topicImages = [javaImage, databaseImage, webImage];

function getTopicIcon(title) {
  const normalized = title.toLowerCase();

  if (normalized.includes('sql') || normalized.includes('db') || normalized.includes('database')) {
    return <FiDatabase />;
  }

  if (normalized.includes('web') || normalized.includes('react') || normalized.includes('html')) {
    return <FiCode />;
  }

  return <FiBookOpen />;
}

function Topics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get('filter') || 'all';
  const [topics, setTopics] = useState([]);
  const [progress, setProgress] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingBookmarkId, setSavingBookmarkId] = useState(null);

  useEffect(() => {
    async function loadTopics() {
      try {
        const [topicData, progressData, savedData] = await Promise.all([getTopics(), getProgress(), getSavedTopics()]);
        setTopics(topicData);
        setProgress(progressData);
        setSavedIds(new Set(savedData.map((topic) => topic.topicId)));
      } catch (err) {
        setError('Unable to load topics. Please check backend server.');
      } finally {
        setLoading(false);
      }
    }

    loadTopics();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading topics..." />;
  }

  if (error) {
    return <EmptyState icon={<FiBookOpen />} title="Topics unavailable" message={error} />;
  }

  const completedIds = new Set(progress?.completedTopics?.map((item) => item.topicId) || []);
  const filteredTopics = topics.filter((topic) => {
    if (activeFilter === 'completed') {
      return completedIds.has(topic.id);
    }

    if (activeFilter === 'pending') {
      return !completedIds.has(topic.id);
    }

    return true;
  });

  function changeFilter(filter) {
    if (filter === 'all') {
      setSearchParams({});
      return;
    }

    setSearchParams({ filter });
  }

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
          <span className="eyebrow">Java Full Stack Development</span>
          <h1>Java Full Stack Course Modules</h1>
          <p>These modules build your path from Java basics to a complete full stack project.</p>
          {progress && (
            <div className="progress-summary">
              <div>
                <strong>{progress.progressPercentage}%</strong>
                <span>{progress.completedCount} completed · {progress.pendingCount} pending</span>
              </div>
              <div className="progress-track">
                <span style={{ width: `${progress.progressPercentage}%` }} />
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="topic-filter-bar panel">
        <button className={activeFilter === 'all' ? 'active' : ''} type="button" onClick={() => changeFilter('all')}>
          All Modules
          <span>{topics.length}</span>
        </button>
        <button className={activeFilter === 'pending' ? 'active' : ''} type="button" onClick={() => changeFilter('pending')}>
          Pending Modules
          <span>{progress?.pendingCount ?? 0}</span>
        </button>
        <button className={activeFilter === 'completed' ? 'active' : ''} type="button" onClick={() => changeFilter('completed')}>
          Completed Modules
          <span>{progress?.completedCount ?? 0}</span>
        </button>
      </section>

      {topics.length === 0 ? (
        <EmptyState icon={<FiBookOpen />} title="No topics found" message="Topics will appear here after they are added in the backend." />
      ) : filteredTopics.length === 0 ? (
        <EmptyState
          icon={activeFilter === 'completed' ? <FiCheckCircle /> : <FiBookOpen />}
          title={activeFilter === 'completed' ? 'No completed topics yet' : 'No pending topics'}
          message={activeFilter === 'completed' ? 'Completed topics will appear here after you mark them complete.' : 'Newly added topics appear here until you complete them.'}
        />
      ) : (
        <section className="topic-grid">
          {filteredTopics.map((topic, index) => {
            const isCompleted = progress?.completedTopics?.some((item) => item.topicId === topic.id);
            const isSaved = savedIds.has(topic.id);

            return (
            <article className="topic-card" key={topic.id}>
              <img src={topicImages[index % topicImages.length]} alt="" />
              <div className="topic-card-body">
                <div className="topic-card-top">
                  <div className="topic-icon">{getTopicIcon(topic.title)}</div>
                  <span className={`topic-status ${isCompleted ? 'completed' : 'pending'}`}>
                    {isCompleted ? <FiCheckCircle aria-hidden="true" /> : <FiBookOpen aria-hidden="true" />}
                    {isCompleted ? 'Completed' : 'Pending'}
                  </span>
                </div>
                <h2>{topic.title}</h2>
                <p>{topic.description}</p>
                <div className="topic-meta">
                  <span>{topic.difficulty || 'Beginner'}</span>
                  <span>{topic.estimatedTimeMinutes || 45} min</span>
                </div>
                <div className="topic-actions">
                  <button
                    className="secondary-button compact"
                    type="button"
                    onClick={() => toggleSaved(topic.id)}
                    disabled={savingBookmarkId === topic.id}
                  >
                    <FiBookmark aria-hidden="true" />
                    {savingBookmarkId === topic.id ? 'Saving...' : (isSaved ? 'Saved' : 'Save')}
                  </button>
                  <Link className="secondary-link" to={`/topics/${topic.id}`}>
                    Study <FiArrowRight aria-hidden="true" />
                  </Link>
                  <Link className="primary-link" to={`/quiz/${topic.id}`}>Take Quiz</Link>
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

export default Topics;
