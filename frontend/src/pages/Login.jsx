import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiLock, FiMail } from 'react-icons/fi';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { loginUser, saveAuth } from '../services/authService';

function Login({ adminMode = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || (adminMode ? '/admin' : '/dashboard');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const authData = await loginUser(formData);

      if (adminMode && authData.role !== 'ADMIN') {
        setError('Admin access only. Please use an admin account.');
        toast.error('Admin access only');
        return;
      }

      saveAuth(authData, authData.role === 'ADMIN' ? 'admin' : 'student');
      toast.success('Welcome back to SMARTED');
      navigate(authData.role === 'ADMIN' ? '/admin' : from, { replace: true });
    } catch (err) {
      setError('Invalid email or password');
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-layout">
        <div className="auth-hero panel">
          <span className="eyebrow">{adminMode ? 'Admin portal' : 'SMARTED'}</span>
          <h1>{adminMode ? 'Manage SMARTED content and students.' : 'Continue your personalized learning path.'}</h1>
          <p>{adminMode ? 'Use the admin account to manage topics, quiz questions, and student records.' : 'Access topics, quizzes, AI tutor support, and your progress dashboard after login.'}</p>
          <div className="auth-highlights">
            <span>Adaptive levels</span>
            <span>Quiz analytics</span>
            <span>AI guidance</span>
          </div>
        </div>

        <div className="auth-card panel">
          <h1>{adminMode ? 'Admin Login' : 'Login'}</h1>
          <p className="muted">{adminMode ? 'Use the admin account configured for this deployment.' : 'Enter your student account details.'}</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Email
              <span className="input-shell">
                <FiMail aria-hidden="true" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@example.com"
                  required
                />
              </span>
            </label>

            <label>
              Password
              <span className="input-shell">
                <FiLock aria-hidden="true" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </span>
            </label>

            {error && <p className="error-text">{error}</p>}

            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? <LoadingSpinner label="Logging in..." /> : (adminMode ? 'Login as Admin' : 'Login')}
            </button>
          </form>

          {!adminMode && (
            <p className="auth-switch">
              New student? <Link to="/register">Create account</Link>
            </p>
          )}
          {adminMode && (
            <p className="auth-switch">
              Student? <Link to="/login">Go to student login</Link>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Login;
