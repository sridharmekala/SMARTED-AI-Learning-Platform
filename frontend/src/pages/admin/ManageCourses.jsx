import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiBookOpen, FiEdit2, FiTrash2 } from 'react-icons/fi';
import AdminLayout from './AdminLayout.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import { addCourse, deleteCourse, getAdminCourses, updateCourse } from '../../services/adminService';

const emptyCourse = { name: '', description: '' };

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyCourse);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadCourses() {
    setCourses(await getAdminCourses());
  }

  useEffect(() => {
    async function load() {
      try {
        await loadCourses();
      } catch (err) {
        toast.error(err.response?.data || 'Unable to load courses');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function startEdit(course) {
    setEditingCourseId(course.id);
    setForm({ name: course.name, description: course.description || '' });
  }

  function resetForm() {
    setEditingCourseId(null);
    setForm(emptyCourse);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    try {
      if (editingCourseId) {
        await updateCourse(editingCourseId, form);
        toast.success('Course updated');
      } else {
        await addCourse(form);
        toast.success('Course created');
      }
      resetForm();
      await loadCourses();
    } catch (err) {
      toast.error(err.response?.data || 'Unable to save course');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(courseId) {
    if (!window.confirm('Delete this course with its topics, questions, scores, and progress?')) {
      return;
    }

    try {
      await deleteCourse(courseId);
      toast.success('Course deleted');
      await loadCourses();
    } catch (err) {
      toast.error(err.response?.data || 'Unable to delete course');
    }
  }

  return (
    <AdminLayout>
      <div className="page-stack admin-page">
        <section className="admin-section-hero">
          <span className="eyebrow">Course management</span>
          <h2>Create and maintain learning programs.</h2>
          <p>Add courses that students can open, learn from, complete, and track progress against.</p>
        </section>

        <section className="admin-grid">
          <div className="panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Courses</span>
                <h2>{editingCourseId ? 'Update Course' : 'Add Course'}</h2>
              </div>
            </div>
            <form className="admin-form" onSubmit={handleSubmit}>
              <label>
                Course Name
                <input name="name" value={form.name} onChange={handleChange} placeholder="Python Full Stack Development" required />
              </label>
              <label>
                Description
                <textarea name="description" value={form.description} onChange={handleChange} rows="5" required />
              </label>
              <div className="form-actions">
                <button className="primary-button" type="submit" disabled={saving}>
                  {saving ? <LoadingSpinner label="Saving..." /> : (editingCourseId ? 'Update Course' : 'Create Course')}
                </button>
                {editingCourseId && <button className="secondary-button" type="button" onClick={resetForm}>Cancel</button>}
              </div>
            </form>
          </div>

          <div className="panel">
            <h2>All Courses</h2>
            {loading ? (
              <LoadingSpinner label="Loading courses..." />
            ) : courses.length === 0 ? (
              <EmptyState icon={<FiBookOpen />} title="No courses" message="Create your first course." />
            ) : (
              <div className="admin-list">
                {courses.map((course) => (
                  <article className="admin-list-item" key={course.id}>
                    <div>
                      <h3>{course.name}</h3>
                      <p>{course.totalTopics || 0} topics · {course.description}</p>
                    </div>
                    <div className="item-actions">
                      <button className="secondary-button compact" type="button" onClick={() => startEdit(course)}><FiEdit2 /> Edit</button>
                      <button className="danger-button compact" type="button" onClick={() => handleDelete(course.id)}><FiTrash2 /> Delete</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default ManageCourses;
