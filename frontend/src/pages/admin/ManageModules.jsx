import React from 'react';
import AdminFeaturePage from './AdminFeaturePage.jsx';

function ManageModules() {
  return (
    <AdminFeaturePage
      title="Manage Modules"
      description="Organize course modules and prepare module-level exams. Current course topics can be used as learning modules until the backend module entity is split out."
      actions={[
        { label: 'Add Module', description: 'Create a module under a selected course.', to: '/admin/topics/add' },
        { label: 'View Modules', description: 'Review modules by course.', to: '/admin/topics' },
        { label: 'Update Module', description: 'Edit module title, description, difficulty, and content.', to: '/admin/topics' },
        { label: 'Delete Module', description: 'Remove modules that are no longer needed.', to: '/admin/topics' }
      ]}
    />
  );
}

export default ManageModules;
