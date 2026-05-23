import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiEdit2, FiLock, FiTrash2, FiUsers } from 'react-icons/fi';
import EmptyState from '../../components/ui/EmptyState.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import {
  addStudent,
  deleteStudent,
  getStudentProgress,
  getStudents,
  getStudentScores,
  resetStudentPassword,
  updateStudent
} from '../../services/adminService';
import AdminLayout from './AdminLayout.jsx';

const emptyStudent = {
  name: '',
  email: '',
  password: '',
  level: 'Beginner'
};

function ManageStudents({ defaultMode = 'list' }) {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentForm, setStudentForm] = useState(emptyStudent);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [progress, setProgress] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetPassword, setResetPassword] = useState('');

  async function loadStudents() {
    const data = await getStudents();
    setStudents(data);
    if (!selectedStudentId && data[0]?.userId) {
      setSelectedStudentId(data[0].userId);
    }
  }

  useEffect(() => {
    async function load() {
      try {
        await loadStudents();
      } catch (err) {
        toast.error(err.response?.data || 'Unable to load students');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  useEffect(() => {
    async function loadStudentDetails() {
      if (!selectedStudentId) {
        setProgress([]);
        setScores([]);
        return;
      }

      try {
        const [progressData, scoreData] = await Promise.all([
          getStudentProgress(selectedStudentId),
          getStudentScores(selectedStudentId)
        ]);
        setProgress(progressData);
        setScores(scoreData);
      } catch (err) {
        toast.error(err.response?.data || 'Unable to load student details');
      }
    }

    loadStudentDetails();
  }, [selectedStudentId]);

  function handleStudentChange(event) {
    const { name, value } = event.target;
    setStudentForm((current) => ({ ...current, [name]: value }));
  }

  function startEditStudent(student) {
    setEditingStudentId(student.userId);
    setStudentForm({
      name: student.name,
      email: student.email,
      password: '',
      level: student.level || 'Beginner'
    });
  }

  function resetForm() {
    setEditingStudentId(null);
    setStudentForm(emptyStudent);
  }

  async function handleStudentSubmit(event) {
    event.preventDefault();
    setSaving(true);

    try {
      if (editingStudentId) {
        await updateStudent(editingStudentId, studentForm);
        toast.success('Student updated');
      } else {
        await addStudent(studentForm);
        toast.success('Student added');
      }
      resetForm();
      await loadStudents();
    } catch (err) {
      toast.error(err.response?.data || 'Unable to save student');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteStudent(studentId) {
    if (!window.confirm('Delete this student and all related progress, scores, notes, and history?')) {
      return;
    }

    try {
      await deleteStudent(studentId);
      toast.success('Student deleted');
      if (String(selectedStudentId) === String(studentId)) {
        setSelectedStudentId('');
      }
      await loadStudents();
    } catch (err) {
      toast.error(err.response?.data || 'Unable to delete student');
    }
  }

  async function handleResetPassword(event) {
    event.preventDefault();
    if (!selectedStudentId || !resetPassword.trim()) {
      toast.error('Select a student and enter a new password');
      return;
    }

    try {
      await resetStudentPassword(selectedStudentId, resetPassword);
      setResetPassword('');
      toast.success('Password reset');
    } catch (err) {
      toast.error(err.response?.data || 'Unable to reset password');
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner label="Loading students..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="page-stack">
        <section className="hero-banner compact">
          <div>
            <span className="eyebrow">Manage students</span>
            <h1>Student Management</h1>
            <p>Add, edit, delete, reset passwords, and view course progress and quiz scores.</p>
          </div>
        </section>

        <section className="admin-grid">
          <div className="panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">{defaultMode === 'add' ? 'Add student' : 'Student form'}</span>
                <h2>{editingStudentId ? 'Edit Student' : 'Add Student'}</h2>
              </div>
            </div>
            <form className="admin-form" onSubmit={handleStudentSubmit}>
              <label>
                Name
                <input name="name" value={studentForm.name} onChange={handleStudentChange} required />
              </label>
              <label>
                Email
                <input type="email" name="email" value={studentForm.email} onChange={handleStudentChange} required />
              </label>
              {!editingStudentId && (
                <label>
                  Password
                  <input type="password" name="password" value={studentForm.password} onChange={handleStudentChange} required />
                </label>
              )}
              <label>
                Level
                <input name="level" value={studentForm.level} onChange={handleStudentChange} />
              </label>
              <div className="form-actions">
                <button className="primary-button" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : (editingStudentId ? 'Update Student' : 'Add Student')}
                </button>
                {editingStudentId && <button className="secondary-button" type="button" onClick={resetForm}>Cancel</button>}
              </div>
            </form>
          </div>

          <div className="panel">
            <h2>Reset Password</h2>
            <form className="admin-form" onSubmit={handleResetPassword}>
              <label>
                Student
                <select value={selectedStudentId} onChange={(event) => setSelectedStudentId(event.target.value)}>
                  <option value="">Select student</option>
                  {students.map((student) => (
                    <option value={student.userId} key={student.userId}>{student.name}</option>
                  ))}
                </select>
              </label>
              <label>
                New Password
                <input type="password" value={resetPassword} onChange={(event) => setResetPassword(event.target.value)} />
              </label>
              <button className="secondary-button" type="submit">
                <FiLock aria-hidden="true" />
                Reset Password
              </button>
            </form>
          </div>
        </section>

        <section className="panel">
          <h2>View Students</h2>
          {students.length === 0 ? (
            <EmptyState icon={<FiUsers />} title="No students" message="Add the first student using the form above." />
          ) : (
            <div className="table-wrap">
              <table className="score-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Level</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.userId}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.level}</td>
                      <td>{student.joinedDate ? new Date(student.joinedDate).toLocaleDateString() : 'NA'}</td>
                      <td>
                        <div className="item-actions">
                          <button className="secondary-button compact" type="button" onClick={() => setSelectedStudentId(student.userId)}>Details</button>
                          <button className="secondary-button compact" type="button" onClick={() => startEditStudent(student)}><FiEdit2 /> Edit</button>
                          <button className="danger-button compact" type="button" onClick={() => handleDeleteStudent(student.userId)}><FiTrash2 /> Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="admin-grid">
          <div className="panel">
            <h2>Student Progress</h2>
            {progress.length === 0 ? (
              <EmptyState icon={<FiUsers />} title="No progress" message="Select a student to view course progress." />
            ) : (
              <div className="admin-list">
                {progress.map((course) => (
                  <article className="admin-list-item" key={course.courseId}>
                    <div>
                      <h3>{course.courseName}</h3>
                      <p>{course.completedTopics} completed, {course.pendingTopics} pending, {course.totalTopics} total</p>
                    </div>
                    <strong>{course.progressPercentage}%</strong>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="panel">
            <h2>Student Scores</h2>
            {scores.length === 0 ? (
              <EmptyState icon={<FiUsers />} title="No scores" message="Student quiz scores will appear here." />
            ) : (
              <div className="table-wrap">
                <table className="score-table">
                  <thead>
                    <tr>
                      <th>Topic</th>
                      <th>Score</th>
                      <th>Level</th>
                      <th>Attempted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.map((score) => (
                      <tr key={score.scoreId}>
                        <td>{score.topicTitle}</td>
                        <td>{score.score}%</td>
                        <td>{score.level}</td>
                        <td>{new Date(score.attemptedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default ManageStudents;
