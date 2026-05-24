import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBell, FiBookOpen, FiCalendar, FiCheckCircle, FiTarget, FiTrendingUp } from 'react-icons/fi';
import ScoreChart from '../components/ScoreChart.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import LevelBadge from '../components/ui/LevelBadge.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import { getDashboard } from '../services/dashboardService';
import { logoutUser } from '../services/authService';

function Dashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getDashboard();
        setDashboard(data);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          logoutUser('student');
          navigate('/login');
          return;
        }

        setError('Unable to load dashboard. Please check backend server.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [navigate]);

  if (loading) {
    return <LoadingSpinner label="Loading dashboard..." />;
  }

  if (error) {
    return <EmptyState icon={<FiTarget />} title="Dashboard unavailable" message={error} />;
  }

  const latestScore = dashboard.scoreHistory[0]?.score ?? 'NA';
  const completedQuizzes = dashboard.scoreHistory.length;
  const completedTopics = dashboard.completedTopics ?? 0;
  const pendingTopics = dashboard.pendingTopics ?? 0;
  const newTopics = dashboard.newTopics ?? 0;
  const progressPercentage = dashboard.progressPercentage ?? 0;
  const initials = dashboard.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="page-stack dashboard-layout">
      <section className="hero-banner">
        <div>
          <span className="eyebrow">Learning dashboard</span>
          <h1>Java Full Stack Course Progress</h1>
          <p>Welcome back, {dashboard.name}. Track your Java Full Stack Development modules, quizzes, AI tutor practice, and completion progress.</p>
          <div className="progress-summary">
            <div>
              <strong>{progressPercentage}%</strong>
              <span>Java Full Stack Development</span>
            </div>
            <div className="progress-track">
              <span style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>
          <div className="hero-actions">
            <Link className="secondary-link" to="/notifications">
              <FiBell aria-hidden="true" />
              View Reminders
            </Link>
            <Link className="primary-link" to="/daily-plan">
              <FiCalendar aria-hidden="true" />
              Today's Plan
            </Link>
            <Link className="primary-link" to="/topics">Explore Course Modules</Link>
            <Link className="secondary-link" to="/chat">Ask AI Tutor</Link>
          </div>
        </div>
        <div className="hero-profile-card">
          <div className="profile-avatar large">{initials}</div>
          <strong>{dashboard.email}</strong>
          <LevelBadge level={dashboard.level} />
        </div>
      </section>

      <section className="stats-grid">
        <StatCard icon={<FiCheckCircle />} label="Completed Topics" value={completedTopics} tone="green" to="/topics/status/completed" />
        <StatCard icon={<FiBookOpen />} label="Pending Topics" value={pendingTopics} tone="amber" to="/topics/status/pending" />
        <StatCard icon={<FiTrendingUp />} label="New Topics" value={newTopics} tone="blue" to="/topics/status/new" />
      </section>

      <section className="dashboard-grid">
        <div className="panel profile-panel">
          <h2>Profile</h2>
          <dl className="profile-list">
            <div>
              <dt>Name</dt>
              <dd>{dashboard.name}</dd>
            </div>
            <div>
              <dt>User ID</dt>
              <dd>{dashboard.userId}</dd>
            </div>
            <div>
              <dt>Current Level</dt>
              <dd>{dashboard.level}</dd>
            </div>
            <div>
              <dt>Quiz Attempts</dt>
              <dd>{completedQuizzes}</dd>
            </div>
          </dl>
        </div>

        <div className="panel recommendations-panel">
          <h2>Smart Recommendations</h2>
          {dashboard.recommendedTopics.length === 0 ? (
            <EmptyState
              icon={<FiCheckCircle />}
              title="No weak topics right now"
              message="Your latest scores look good. Try a new topic when you are ready."
            />
          ) : (
            <div className="recommendation-list">
              {dashboard.recommendedTopics.map((topic) => (
                <article className="recommendation-item" key={topic.topicId}>
                  <div>
                    <h3>{topic.title}</h3>
                    <p>{topic.reason}</p>
                    {topic.latestScore !== null && (
                      <span>Latest score: {topic.latestScore}%</span>
                    )}
                  </div>
                  <Link className="secondary-link" to={`/topics/${topic.topicId}`}>Study</Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <ScoreChart scoreHistory={dashboard.scoreHistory} />

      <section className="panel">
        <h2>Score History</h2>
        {dashboard.scoreHistory.length === 0 ? (
          <EmptyState icon={<FiTrendingUp />} title="No quiz attempts yet" message="Complete a quiz to see your score history here." />
        ) : (
          <div className="table-wrap">
            <table className="score-table">
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Score</th>
                  <th>Level</th>
                  <th>Attempted At</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.scoreHistory.map((score) => (
                  <tr key={score.scoreId}>
                    <td>{score.topicTitle}</td>
                    <td>{score.score}</td>
                    <td>{score.level}</td>
                    <td>{new Date(score.attemptedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
