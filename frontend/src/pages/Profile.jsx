import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FiAward, FiCalendar, FiLock, FiMail, FiSave, FiUser } from 'react-icons/fi';
import EmptyState from '../components/ui/EmptyState.jsx';
import LevelBadge from '../components/ui/LevelBadge.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import { logoutUser, saveAuth } from '../services/authService';
import { getProfile, updateProfile } from '../services/profileService';

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile();
        setProfile(data);
        setFormData((current) => ({
          ...current,
          name: data.name,
          email: data.email
        }));
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          logoutUser('student');
          navigate('/login');
          return;
        }

        setError('Unable to load profile.');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [navigate]);

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

    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and email are required.');
      toast.error('Name and email are required.');
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      toast.error('New password must be at least 6 characters.');
      return;
    }

    if (formData.newPassword && !formData.currentPassword) {
      setError('Current password is required to change password.');
      toast.error('Current password is required to change password.');
      return;
    }

    setSaving(true);

    try {
      const authData = await updateProfile({
        name: formData.name,
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      saveAuth(authData, 'student');
      const refreshedProfile = await getProfile();
      setProfile(refreshedProfile);
      setFormData({
        name: refreshedProfile.name,
        email: refreshedProfile.email,
        currentPassword: '',
        newPassword: ''
      });
      toast.success('Profile updated successfully');
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        logoutUser('student');
        navigate('/login');
        return;
      }

      const message = err.response?.data || 'Unable to update profile.';
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading profile..." />;
  }

  if (error && !profile) {
    return <EmptyState icon={<FiUser />} title="Profile unavailable" message={error} />;
  }

  const initials = profile.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const joinedDate = profile.joinedDate
    ? new Date(profile.joinedDate).toLocaleDateString()
    : 'Not available';

  return (
    <div className="page-stack">
      <section className="profile-hero panel">
        <div className="profile-avatar large">{initials}</div>
        <div>
          <span className="eyebrow">Student profile</span>
          <h1>{profile.name}</h1>
          <p>{profile.email}</p>
        </div>
        <LevelBadge level={profile.level} />
      </section>

      <section className="stats-grid">
        <StatCard icon={<FiUser />} label="User ID" value={profile.userId} tone="blue" />
        <StatCard icon={<FiAward />} label="Student Level" value={profile.level} tone="green" />
        <StatCard icon={<FiCalendar />} label="Joined Date" value={joinedDate} tone="amber" />
      </section>

      <section className="panel profile-edit-panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Manage account</span>
            <h2>Update Profile</h2>
          </div>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
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
            Current Password
            <span className="input-shell">
              <FiLock aria-hidden="true" />
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Required only for password change"
              />
            </span>
          </label>

          <label>
            New Password
            <span className="input-shell">
              <FiLock aria-hidden="true" />
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
                minLength="6"
              />
            </span>
          </label>

          {error && <p className="error-text">{error}</p>}

          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? <LoadingSpinner label="Saving..." /> : (
              <>
                <FiSave aria-hidden="true" />
                Save Changes
              </>
            )}
          </button>
        </form>
      </section>
    </div>
  );
}

export default Profile;
