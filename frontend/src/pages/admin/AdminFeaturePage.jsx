import React from 'react';
import { Link } from 'react-router-dom';
import { FiCpu, FiTool } from 'react-icons/fi';
import AdminLayout from './AdminLayout.jsx';

function AdminFeaturePage({ title, description, actions = [], ai = false }) {
  return (
    <AdminLayout>
      <div className="page-stack">
        <section className="hero-banner compact">
          <div>
            <span className="eyebrow">Admin workspace</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </section>

        <section className="admin-action-grid">
          {actions.map((action) => (
            <article className="panel admin-action-card" key={action.label}>
              <div className="topic-icon">{ai ? <FiCpu /> : <FiTool />}</div>
              <h2>{action.label}</h2>
              <p>{action.description}</p>
              {action.to && <Link className="secondary-link" to={action.to}>Open</Link>}
            </article>
          ))}
        </section>
      </div>
    </AdminLayout>
  );
}

export default AdminFeaturePage;
