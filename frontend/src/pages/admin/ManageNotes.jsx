import React from 'react';
import AdminFeaturePage from './AdminFeaturePage.jsx';

function ManageNotes() {
  return (
    <AdminFeaturePage
      title="Manage Notes"
      description="Manage learning notes topic-wise. Admin AI-generated notes will plug into this workspace."
      actions={[
        { label: 'Add Notes', description: 'Prepare notes for a topic.' },
        { label: 'View Notes', description: 'Review notes topic-wise.' },
        { label: 'Update Notes', description: 'Edit notes for clarity and completeness.' },
        { label: 'Delete Notes', description: 'Remove outdated notes.' }
      ]}
    />
  );
}

export default ManageNotes;
