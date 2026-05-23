import React, { useEffect, useState } from 'react';
import { FiLogOut, FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar.jsx';
import { logoutUser } from '../../services/authService';

function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  function handleLogout() {
    logoutUser('admin');
    navigate('/admin/login');
  }

  return (
    <div className={`admin-console-shell ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-console-content">
        <header className="admin-topbar">
          <button
            className="admin-menu-toggle"
            type="button"
            aria-label={sidebarOpen ? 'Close admin sidebar' : 'Open admin sidebar'}
            onClick={() => setSidebarOpen((current) => !current)}
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
          <div>
            <span>SMARTED admin workspace</span>
            <strong>Manage learning content and students</strong>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" type="button" onClick={toggleTheme} aria-label="Toggle color theme">
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>
            <button className="secondary-button compact" type="button" onClick={handleLogout}>
              <FiLogOut aria-hidden="true" />
              Logout
            </button>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;
