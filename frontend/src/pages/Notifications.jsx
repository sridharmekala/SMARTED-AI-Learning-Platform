import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiCheckCircle, FiTarget } from 'react-icons/fi';
import EmptyState from '../components/ui/EmptyState.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { getNotifications } from '../services/notificationService';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadNotifications() {
      try {
        setNotifications(await getNotifications());
      } catch (err) {
        setError('Unable to load notifications.');
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading notifications..." />;
  }

  if (error) {
    return <EmptyState icon={<FiBell />} title="Notifications unavailable" message={error} />;
  }

  return (
    <div className="page-stack">
      <section className="hero-banner compact">
        <div>
          <span className="eyebrow">Learning reminders</span>
          <h1>Notifications</h1>
          <p>Stay on track with pending topics, quiz reminders, and weak-subject revision alerts.</p>
        </div>
      </section>

      {notifications.length === 0 ? (
        <EmptyState icon={<FiCheckCircle />} title="No notifications" message="You are all caught up right now." />
      ) : (
        <section className="notification-list">
          {notifications.map((item, index) => (
            <article className={`notification-card panel priority-${item.priority?.toLowerCase()}`} key={`${item.type}-${item.topicId || index}`}>
              <div className="notification-icon">
                {item.type === 'WEAK_TOPIC' ? <FiTarget /> : <FiBell />}
              </div>
              <div>
                <span className="eyebrow">{item.priority} Priority</span>
                <h2>{item.title}</h2>
                <p>{item.message}</p>
                {item.createdAt && (
                  <div className="topic-meta">
                    <span>{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
              <Link className="primary-link" to={item.actionUrl}>
                {item.actionLabel}
              </Link>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default Notifications;
