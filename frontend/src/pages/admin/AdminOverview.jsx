import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  FiActivity,
  FiBookOpen,
  FiBriefcase,
  FiCheckCircle,
  FiCpu,
  FiFileText,
  FiLayers,
  FiTrendingUp,
  FiUsers
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import { getAuthUser } from '../../services/authService';
import { getAdminCourses, getAdminCourseTopics, getAdminQuizQuestions, getStudents } from '../../services/adminService';

const quickModules = [
  { icon: <FiBookOpen />, title: 'Course Builder', text: 'Create programs, attach modules, and keep learning paths structured.' },
  { icon: <FiLayers />, title: 'Topic Management', text: 'Organize lessons, notes, estimated time, and topic difficulty.' },
  { icon: <FiFileText />, title: 'Quiz & Exam Bank', text: 'Maintain question sets for practice quizzes and module exams.' },
  { icon: <FiUsers />, title: 'Student Tracking', text: 'Review learner profiles, progress, scores, and pending work.' },
  { icon: <FiCpu />, title: 'AI Learning Tools', text: 'Generate notes, quizzes, exams, and performance insights.' },
  { icon: <FiTrendingUp />, title: 'Leaderboard', text: 'Show top performers, rankings, average scores, and course-wise results.' }
];

function AdminOverview() {
  const user = getAuthUser('admin');
  const [summary, setSummary] = useState({
    courses: 0,
    topics: 0,
    questions: 0,
    students: 0
  });
  const [loading, setLoading] = useState(true);
  const initials = user?.name
    ? user.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
    : 'A';

  useEffect(() => {
    async function loadSummary() {
      try {
        const [courses, questions, students] = await Promise.all([
          getAdminCourses(),
          getAdminQuizQuestions(),
          getStudents()
        ]);
        const topicCounts = await Promise.all(
          courses.map((course) => getAdminCourseTopics(course.id).catch(() => []))
        );

        setSummary({
          courses: courses.length,
          topics: topicCounts.reduce((total, topics) => total + topics.length, 0),
          questions: questions.length,
          students: students.length
        });
      } catch (err) {
        toast.error(err.response?.data || 'Unable to load admin overview');
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, []);

  return (
    <AdminLayout>
      <div className="page-stack admin-page">
        <section className="hero-banner admin-dashboard-hero">
          <div>
            <span className="eyebrow">Admin dashboard</span>
            <h1>SMARTED Management Console</h1>
            <p>
              Welcome back, {user?.name || 'SMARTED Admin'}. Manage courses, topics, quizzes, students,
              AI tools, leaderboard data, and learning progress from one workspace.
            </p>
            <div className="progress-summary">
              <div>
                <strong>{summary.courses}</strong>
                <span>Active learning programs</span>
              </div>
              <div className="progress-track">
                <span style={{ width: `${Math.min(100, summary.courses * 20)}%` }} />
              </div>
            </div>
            <div className="hero-actions">
              <Link className="primary-link" to="/admin/courses/add">
                <FiBriefcase aria-hidden="true" />
                Add Course
              </Link>
              <Link className="primary-link" to="/admin/topics/add">
                <FiBookOpen aria-hidden="true" />
                Add Topic
              </Link>
              <Link className="secondary-link" to="/admin/quizzes/add">
                <FiFileText aria-hidden="true" />
                Add Quiz
              </Link>
              <Link className="secondary-link" to="/admin/students">
                <FiUsers aria-hidden="true" />
                View Students
              </Link>
            </div>
          </div>
          <div className="hero-profile-card">
            <div className="profile-avatar large">{initials}</div>
            <strong>{user?.email || 'admin@smarted.com'}</strong>
            <span className="level-badge">Administrator</span>
          </div>
        </section>

        {loading ? (
          <section className="panel">
            <LoadingSpinner label="Loading admin overview..." />
          </section>
        ) : (
          <section className="stats-grid admin-stats-grid">
            <StatCard icon={<FiBookOpen />} label="Courses" value={summary.courses} tone="green" />
            <StatCard icon={<FiLayers />} label="Topics" value={summary.topics} tone="blue" />
            <StatCard icon={<FiFileText />} label="Quiz Questions" value={summary.questions} tone="amber" />
            <StatCard icon={<FiUsers />} label="Students" value={summary.students} tone="green" />
          </section>
        )}

        <section className="dashboard-grid">
          <div className="panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Admin profile</span>
                <h2>Workspace Details</h2>
              </div>
            </div>
            <dl className="profile-list">
              <div>
                <dt>Name</dt>
                <dd>{user?.name || 'SMARTED Admin'}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{user?.email || 'admin@smarted.com'}</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>Administrator</dd>
              </div>
              <div>
                <dt>Project</dt>
                <dd>SMARTED LMS</dd>
              </div>
            </dl>
          </div>

          <div className="panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Platform workflow</span>
                <h2>Admin Responsibilities</h2>
              </div>
            </div>
            <div className="admin-health-list">
              <p><FiActivity /> Keep courses updated with current modules and topics.</p>
              <p><FiCheckCircle /> Review pending topics and student completion progress.</p>
              <p><FiFileText /> Maintain quiz questions, exam questions, scores, and leaderboard quality.</p>
            </div>
          </div>
        </section>

        <section className="admin-module-grid">
          {quickModules.map((module) => (
            <article className="admin-module-card" key={module.title}>
              <span>{module.icon}</span>
              <h3>{module.title}</h3>
              <p>{module.text}</p>
            </article>
          ))}
        </section>
      </div>
    </AdminLayout>
  );
}

export default AdminOverview;
