import React from 'react';
import AdminFeaturePage from './AdminFeaturePage.jsx';

function AdminAITools() {
  return (
    <AdminFeaturePage
      title="AI Tools"
      description="AI tools workspace for generating notes, quizzes, exams, and analyzing student performance."
      ai
      actions={[
        { label: 'Generate Notes', description: 'Generate topic notes using AI.' },
        { label: 'Generate Quiz', description: 'Create quiz questions from topic content.' },
        { label: 'Generate Module Exam', description: 'Generate module-level exam questions.' },
        { label: 'Analyze Student Performance', description: 'Summarize weak areas and student progress.' }
      ]}
    />
  );
}

export default AdminAITools;
