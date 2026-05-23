import React from 'react';

function EmptyState({ icon, title, message, action }) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-icon">{icon}</div>}
      <h2>{title}</h2>
      <p>{message}</p>
      {action}
    </div>
  );
}

export default EmptyState;
