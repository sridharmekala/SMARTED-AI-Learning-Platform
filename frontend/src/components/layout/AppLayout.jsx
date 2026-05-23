import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FiBookOpen,
  FiBell,
  FiBookmark,
  FiBriefcase,
  FiCalendar,
  FiGrid,
  FiLogIn,
  FiLogOut,
  FiMenu,
  FiMessageCircle,
  FiMoon,
  FiEdit3,
  FiAward,
  FiSearch,
  FiSun,
  FiUser,
  FiUserPlus,
  FiX
} from 'react-icons/fi';
import { getAuthUser, isAdmin, isAuthenticated, logoutUser } from '../../services/authService';

function AppLayout({ children }) {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated('student');
  const admin = isAdmin('student');
  const user = getAuthUser('student');
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 1080);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  function handleLogout() {
    logoutUser('student');
    setSidebarOpen(false);
    navigate('/login');
  }

  function toggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  function handleSidebarLinkClick() {
    if (window.innerWidth <= 1080) {
      setSidebarOpen(false);
    }
  }

  const protectedLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <FiGrid /> },
    { to: '/search', label: 'Search', icon: <FiSearch /> },
    { to: '/notifications', label: 'Notifications', icon: <FiBell /> },
    { to: '/leaderboard', label: 'Leaderboard', icon: <FiAward /> },
    { to: '/daily-plan', label: 'Daily Plan', icon: <FiCalendar /> },
    { to: '/courses', label: 'Courses', icon: <FiBookOpen /> },
    { to: '/topics', label: 'Topics', icon: <FiBookOpen /> },
    { to: '/saved-topics', label: 'Saved Topics', icon: <FiBookmark /> },
    { to: '/notes', label: 'My Notes', icon: <FiEdit3 /> },
    { to: '/chat', label: 'AI Tutor', icon: <FiMessageCircle /> },
    { to: '/profile', label: 'Profile', icon: <FiUser /> }
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin Panel', icon: <FiBriefcase /> }
  ];

  const publicLinks = [
    { to: '/login', label: 'Login', icon: <FiLogIn /> },
    { to: '/register', label: 'Register', icon: <FiUserPlus /> }
  ];

  const navLinks = loggedIn ? (admin ? [] : protectedLinks) : publicLinks;
  const initials = user?.name
    ? user.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
    : 'ST';

  return (
    <div className={`app-shell ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      {sidebarOpen && (
        <button
          className="sidebar-backdrop"
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <Link className="brand" to={loggedIn ? (admin ? '/admin' : '/dashboard') : '/login'} onClick={handleSidebarLinkClick}>
            <span className="brand-mark">S</span>
            <span>SMARTED</span>
          </Link>
          <button className="icon-button mobile-only" type="button" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <FiX />
          </button>
        </div>

        <nav className="side-nav" aria-label="Main navigation">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleSidebarLinkClick}
              className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {loggedIn && (
          <div className="sidebar-profile">
            <div className="avatar">{initials}</div>
            <div>
              <strong>{user?.name || 'Student'}</strong>
              <span>{admin ? 'Administrator' : (user?.level || 'Learner')}</span>
            </div>
          </div>
        )}
      </aside>

      <div className="main-column">
        <header className="topbar">
          <button
            className="icon-button"
            type="button"
            onClick={() => setSidebarOpen((current) => !current)}
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
          >
            <FiMenu />
          </button>

          <div className="topbar-title">
            <span>Personalized learning workspace</span>
            <strong>Build skills one topic at a time</strong>
          </div>

          <div className="topbar-actions">
            <button className="icon-button" type="button" onClick={toggleTheme} aria-label="Toggle color theme">
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>
            {loggedIn && (
              <button className="secondary-button compact" type="button" onClick={handleLogout}>
                <FiLogOut aria-hidden="true" />
                Logout
              </button>
            )}
          </div>
        </header>

        <main className="page-shell">{children}</main>

        <footer className="footer">
          <span>SMARTED Learning Platform</span>
          <span>Academic project dashboard for guided practice and progress.</span>
        </footer>
      </div>
    </div>
  );
}

export default AppLayout;
