import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiCpu,
  FiEdit3,
  FiFileText,
  FiGrid,
  FiLayers,
  FiUser,
  FiUsers
} from 'react-icons/fi';
import { getAuthUser } from '../../services/authService';

const navItems = [
  { to: '/admin', label: 'Admin Dashboard', icon: <FiGrid />, end: true },
  { to: '/admin/courses', label: 'Courses', icon: <FiBriefcase />, end: true },
  { to: '/admin/modules', label: 'Modules', icon: <FiLayers />, end: true },
  { to: '/admin/topics', label: 'Topics', icon: <FiBookOpen />, end: true },
  { to: '/admin/notes', label: 'Notes', icon: <FiEdit3 />, end: true },
  { to: '/admin/quizzes', label: 'Quiz Questions', icon: <FiFileText />, end: true },
  { to: '/admin/exams', label: 'Exams', icon: <FiFileText />, end: true },
  { to: '/admin/students', label: 'Students', icon: <FiUsers />, end: true },
  { to: '/admin/leaderboard', label: 'Leaderboard', icon: <FiAward /> },
  { to: '/admin/ai-tools', label: 'AI Tools', icon: <FiCpu /> },
  { to: '/admin/profile', label: 'Profile', icon: <FiUser /> }
];

function AdminSidebar({ open = true, onClose }) {
  const user = getAuthUser('admin');
  const initials = user?.name
    ? user.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
    : 'A';

  function handleLinkClick() {
    if (window.innerWidth <= 860) {
      onClose?.();
    }
  }

  return (
    <aside className={`admin-sidebar ${open ? 'open' : 'closed'}`}>
      <div className="admin-sidebar-header">
        <span className="brand-mark">A</span>
        <div>
          <strong>SMARTED</strong>
          <span>Admin console</span>
        </div>
      </div>

      <nav className="admin-menu" aria-label="Admin navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={handleLinkClick}
            className={({ isActive }) => `admin-side-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-profile">
        <div className="avatar">{initials}</div>
        <div>
          <strong>{user?.name || 'SMARTED Admin'}</strong>
          <span>Administrator</span>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
