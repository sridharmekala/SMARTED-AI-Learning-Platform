import React from 'react';
import AdminFeaturePage from './AdminFeaturePage.jsx';

function ManageExams() {
  return (
    <AdminFeaturePage
      title="Manage Exams"
      description="Create and manage module exam questions. This screen is ready for the upcoming exam entity."
      actions={[
        { label: 'Add Module Exam', description: 'Create exam questions for a module.' },
        { label: 'View Exams', description: 'Review module exams.' },
        { label: 'Update Exam', description: 'Edit exam questions and answers.' },
        { label: 'Delete Exam', description: 'Remove exam questions.' }
      ]}
    />
  );
}

export default ManageExams;
