import React from 'react';
import { Link } from 'react-router-dom';

function StatCard({ icon, label, value, tone = 'blue', to }) {
  const content = (
    <article className={`stat-card tone-${tone}`}>
      <div className="stat-icon">{icon}</div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </article>
  );

  if (to) {
    return (
      <Link className="stat-card-link" to={to}>
        {content}
      </Link>
    );
  }

  return content;
}

export default StatCard;
