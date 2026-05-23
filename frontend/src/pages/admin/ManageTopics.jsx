import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiBookOpen, FiEdit2, FiTrash2 } from 'react-icons/fi';
import AdminLayout from './AdminLayout.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import { addCourseTopic, deleteTopic, getAdminCourses, getAdminCourseTopics, updateTopic } from '../../services/adminService';

const emptyTopic = {
  title: '',
  description: '',
  content: '',
  difficulty: 'Beginner',
  estimatedTimeMinutes: 45
};

function ManageTopics() {
  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [form, setForm] = useState(emptyTopic);
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadTopics(courseId = selectedCourseId) {
    if (!courseId) {
      setTopics([]);
      return;
    }
    setTopics(await getAdminCourseTopics(courseId));
  }

  useEffect(() => {
    async function load() {
      try {
        const courseData = await getAdminCourses();
        setCourses(courseData);
        const firstCourseId = courseData[0]?.id || '';
        setSelectedCourseId(firstCourseId);
        if (firstCourseId) {
          setTopics(await getAdminCourseTopics(firstCourseId));
        }
      } catch (err) {
        toast.error(err.response?.data || 'Unable to load topic management');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleCourseChange(event) {
    const courseId = event.target.value;
    setSelectedCourseId(courseId);
    resetForm();
    try {
      await loadTopics(courseId);
    } catch (err) {
      toast.error(err.response?.data || 'Unable to load course topics');
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function startEdit(topic) {
    setEditingTopicId(topic.id);
    setForm({
      title: topic.title,
      description: topic.description || '',
      content: topic.content || '',
      difficulty: topic.difficulty || 'Beginner',
      estimatedTimeMinutes: topic.estimatedTimeMinutes || 45
    });
  }

  function resetForm() {
    setEditingTopicId(null);
    setForm(emptyTopic);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    try {
      if (editingTopicId) {
        await updateTopic(editingTopicId, form);
        toast.success('Topic updated');
      } else {
        await addCourseTopic(selectedCourseId, form);
        toast.success('Topic added');
      }
      resetForm();
      await loadTopics();
    } catch (err) {
      toast.error(err.response?.data || 'Unable to save topic');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(topicId) {
    if (!window.confirm('Delete this topic and its quiz questions?')) {
      return;
    }

    try {
      await deleteTopic(topicId);
      toast.success('Topic deleted');
      await loadTopics();
    } catch (err) {
      toast.error(err.response?.data || 'Unable to delete topic');
    }
  }

  return (
    <AdminLayout>
      <div className="page-stack admin-page">
        <section className="admin-section-hero">
          <span className="eyebrow">Topic management</span>
          <h2>Add topics inside a selected course.</h2>
          <p>New topics appear as pending for students until they mark the topic as completed.</p>
        </section>

        <section className="admin-grid">
          <div className="panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Topics</span>
                <h2>{editingTopicId ? 'Update Topic' : 'Add Topic'}</h2>
              </div>
            </div>
            <form className="admin-form" onSubmit={handleSubmit}>
              <label>
                Course
                <select value={selectedCourseId} onChange={handleCourseChange} required>
                  <option value="">Select course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
              </label>
              <label>Title<input name="title" value={form.title} onChange={handleChange} required /></label>
              <label>Description<textarea name="description" value={form.description} onChange={handleChange} rows="3" required /></label>
              <label>Content<textarea name="content" value={form.content} onChange={handleChange} rows="6" required /></label>
              <div className="admin-options-grid">
                <label>Difficulty<input name="difficulty" value={form.difficulty} onChange={handleChange} required /></label>
                <label>Estimated Time<input type="number" name="estimatedTimeMinutes" value={form.estimatedTimeMinutes} onChange={handleChange} min="1" required /></label>
              </div>
              <div className="form-actions">
                <button className="primary-button" type="submit" disabled={saving || !selectedCourseId}>
                  {saving ? <LoadingSpinner label="Saving..." /> : (editingTopicId ? 'Update Topic' : 'Add Topic')}
                </button>
                {editingTopicId && <button className="secondary-button" type="button" onClick={resetForm}>Cancel</button>}
              </div>
            </form>
          </div>

          <div className="panel">
            <h2>Topics in Course</h2>
            {loading ? (
              <LoadingSpinner label="Loading topics..." />
            ) : topics.length === 0 ? (
              <EmptyState icon={<FiBookOpen />} title="No topics" message="Select a course and add topics." />
            ) : (
              <div className="admin-list">
                {topics.map((topic) => (
                  <article className="admin-list-item" key={topic.id}>
                    <div>
                      <h3>{topic.title}</h3>
                      <p>{topic.difficulty} · {topic.estimatedTimeMinutes || 45} min · {topic.description}</p>
                    </div>
                    <div className="item-actions">
                      <button className="secondary-button compact" type="button" onClick={() => startEdit(topic)}><FiEdit2 /> Edit</button>
                      <button className="danger-button compact" type="button" onClick={() => handleDelete(topic.id)}><FiTrash2 /> Delete</button>
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

export default ManageTopics;
