import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiLock, FiMail, FiUser } from 'react-icons/fi';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { isAdmin, isAuthenticated, registerUser, saveAuth } from '../services/authService';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
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
      const authData = await registerUser(formData);
      saveAuth(authData, 'student');
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data || 'Registration failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  if (isAuthenticated('student')) {
    return <Navigate to={isAdmin('student') ? '/admin' : '/dashboard'} replace />;
  }

  return (
    <div className="auth-page">
      <section className="auth-layout">
        <div className="auth-hero panel">
          <span className="eyebrow">Student onboarding</span>
          <h1>Create your learning workspace.</h1>
          <p>Track scores, unlock topic practice, and get AI tutor help from one clean dashboard.</p>
          <div className="auth-highlights">
            <span>Beginner friendly</span>
            <span>Modern quizzes</span>
            <span>Progress insights</span>
          </div>
        </div>

        <div className="auth-card panel">
          <h1>Register</h1>
          <p className="muted">Set up your SMARTED student account.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Name
              <span className="input-shell">
                <FiUser aria-hidden="true" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </span>
            </label>

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
                  placeholder="Create password"
                  minLength="6"
                  required
                />
              </span>
            </label>

            {error && <p className="error-text">{error}</p>}

            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? <LoadingSpinner label="Creating account..." /> : 'Register'}
            </button>
          </form>

          <p className="auth-switch">
            Already registered? <Link to="/login">Go to login</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Register;
