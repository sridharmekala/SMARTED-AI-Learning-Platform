import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiCalendar, FiCheckSquare, FiTarget } from 'react-icons/fi';
import EmptyState from '../components/ui/EmptyState.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { getDailyPlan } from '../services/dailyPlanService';

const taskIcons = {
  READ: <FiBookOpen />,
  QUIZ: <FiCheckSquare />,
  REVISE: <FiTarget />
};

function DailyPlan() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPlan() {
      try {
        setPlan(await getDailyPlan());
      } catch (err) {
        setError('Unable to generate today’s learning plan.');
      } finally {
        setLoading(false);
      }
    }

    loadPlan();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Generating today’s plan..." />;
  }

  if (error) {
    return <EmptyState icon={<FiCalendar />} title="Plan unavailable" message={error} />;
  }

  return (
    <div className="page-stack">
      <section className="hero-banner compact">
        <div>
          <span className="eyebrow">Daily learning plan</span>
          <h1>Today’s 3-Step Study Plan</h1>
          <p>{plan.summary}</p>
          <div className="topic-meta">
            <span>{new Date(plan.date).toLocaleDateString()}</span>
            <span>{plan.studentName}</span>
          </div>
        </div>
      </section>

      {plan.tasks.length === 0 ? (
        <EmptyState icon={<FiCheckSquare />} title="No tasks today" message="You are all caught up right now." />
      ) : (
        <section className="daily-plan-list">
          {plan.tasks.map((task, index) => (
            <article className="daily-plan-card panel" key={`${task.type}-${task.topicId || index}`}>
              <div className="daily-plan-step">
                <span>{index + 1}</span>
                {taskIcons[task.type] || <FiTarget />}
              </div>
              <div>
                <span className="eyebrow">{task.type}</span>
                <h2>{task.title}</h2>
                <p>{task.description}</p>
                {task.topicTitle && (
                  <div className="topic-meta">
                    <span>{task.topicTitle}</span>
                  </div>
                )}
              </div>
              <Link className="primary-link" to={task.actionUrl}>
                {task.actionLabel}
              </Link>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default DailyPlan;
