import React from 'react';
import { FiAward } from 'react-icons/fi';

function LevelBadge({ level = 'Beginner' }) {
  return (
    <span className="level-badge">
      <FiAward aria-hidden="true" />
      {level}
    </span>
  );
}

export default LevelBadge;
