import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiAward, FiBarChart2, FiTarget, FiTrendingUp } from 'react-icons/fi';
import EmptyState from '../components/ui/EmptyState.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { getAuthUser } from '../services/authService';
import { getLeaderboard } from '../services/leaderboardService';

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function isCurrentUser(entry, user) {
  return String(entry.studentId) === String(user?.userId);
}

function Leaderboard() {
  const user = getAuthUser('student');
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        setLeaderboard(await getLeaderboard());
      } catch (err) {
        setError('Unable to load leaderboard.');
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading leaderboard..." />;
  }

  if (error) {
    return <EmptyState icon={<FiAward />} title="Leaderboard unavailable" message={error} />;
  }

  const entries = leaderboard.entries || [];
  const topThree = entries.slice(0, 3);
  const currentUserEntry = entries.find((entry) => isCurrentUser(entry, user));

  return (
    <div className="page-stack">
      <section className="hero-banner compact">
        <div>
          <span className="eyebrow">Student ranking</span>
          <h1>Leaderboard</h1>
          <p>Top students are ranked by average quiz score, with attempts and best score included for clarity.</p>
          <div className="hero-actions">
            <Link className="secondary-link" to="/dashboard">
              <FiBarChart2 aria-hidden="true" />
              Dashboard
            </Link>
          </div>
        </div>
      </section>

      {entries.length === 0 ? (
        <EmptyState
          icon={<FiAward />}
          title="No quiz scores yet"
          message="Students will appear here after attempting quizzes."
          action={<Link className="primary-link" to="/courses">Browse Courses</Link>}
        />
      ) : (
        <>
          <section className="leaderboard-podium">
            {topThree.map((entry) => (
              <article
                className={`podium-card rank-${entry.rank} ${isCurrentUser(entry, user) ? 'current-user' : ''}`}
                key={entry.studentId}
              >
                <div className="rank-badge">#{entry.rank}</div>
                <div className="avatar">{initials(entry.studentName)}</div>
                <h2>{entry.studentName}{isCurrentUser(entry, user) ? ' (You)' : ''}</h2>
                <span>{entry.level}</span>
                <strong>{entry.averageScore}%</strong>
                <p>{entry.totalAttempts} attempts - best {entry.bestScore}%</p>
              </article>
            ))}
          </section>

          {currentUserEntry && (
            <section className="current-rank-card panel">
              <div className="notification-icon">
                <FiAward />
              </div>
              <div>
                <span className="eyebrow">Your standing</span>
                <h2>You are ranked #{currentUserEntry.rank}</h2>
                <p>
                  Average score {currentUserEntry.averageScore}% across {currentUserEntry.totalAttempts} quiz attempts.
                  Best score: {currentUserEntry.bestScore}%.
                </p>
              </div>
              <span className="rank-pill">You</span>
            </section>
          )}

          <section className="panel">
            <div className="section-heading">
              <h2>All Rankings</h2>
              <span className="topic-status saved">{leaderboard.totalStudents} students</span>
            </div>

            <div className="table-wrap">
              <table className="score-table leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Student</th>
                    <th>Average Score</th>
                    <th>Attempts</th>
                    <th>Best Score</th>
                    <th>Level</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr className={isCurrentUser(entry, user) ? 'current-user-row' : ''} key={entry.studentId}>
                      <td>
                        <span className="rank-pill">#{entry.rank}</span>
                      </td>
                      <td>
                        <div className="student-cell">
                          <div className="avatar small">{initials(entry.studentName)}</div>
                          <strong>{entry.studentName}</strong>
                          {isCurrentUser(entry, user) && <span className="you-pill">You</span>}
                        </div>
                      </td>
                      <td>
                        <span className="score-strong">{entry.averageScore}%</span>
                      </td>
                      <td>{entry.totalAttempts}</td>
                      <td>{entry.bestScore}%</td>
                      <td>{entry.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="stats-grid">
            <article className="stat-card">
              <div className="stat-icon"><FiAward /></div>
              <div>
                <p>Top Rank</p>
                <strong>#{entries[0].rank}</strong>
              </div>
            </article>
            <article className="stat-card">
              <div className="stat-icon"><FiTrendingUp /></div>
              <div>
                <p>Best Average</p>
                <strong>{entries[0].averageScore}%</strong>
              </div>
            </article>
            <article className="stat-card">
              <div className="stat-icon"><FiTarget /></div>
              <div>
                <p>Total Attempts</p>
                <strong>{entries.reduce((sum, entry) => sum + entry.totalAttempts, 0)}</strong>
              </div>
            </article>
          </section>
        </>
      )}
    </div>
  );
}

export default Leaderboard;
