import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiEdit2, FiFileText, FiTrash2 } from 'react-icons/fi';
import AdminLayout from './AdminLayout.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import {
  addTopicQuestion,
  deleteQuestion,
  getAdminCourses,
  getAdminCourseTopics,
  getAdminQuizQuestions,
  updateQuestion
} from '../../services/adminService';

const emptyQuestion = {
  topicId: '',
  question: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctAnswer: 'A'
};

function ManageQuizzes() {
  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [form, setForm] = useState(emptyQuestion);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadQuestions() {
    setQuestions(await getAdminQuizQuestions());
  }

  useEffect(() => {
    async function load() {
      try {
        const [courseData, questionData] = await Promise.all([getAdminCourses(), getAdminQuizQuestions()]);
        setCourses(courseData);
        setQuestions(questionData);
        const firstCourseId = courseData[0]?.id || '';
        setSelectedCourseId(firstCourseId);
        if (firstCourseId) {
          setTopics(await getAdminCourseTopics(firstCourseId));
        }
      } catch (err) {
        toast.error(err.response?.data || 'Unable to load quiz management');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleCourseChange(event) {
    const courseId = event.target.value;
    setSelectedCourseId(courseId);
    setForm((current) => ({ ...current, topicId: '' }));
    try {
      setTopics(courseId ? await getAdminCourseTopics(courseId) : []);
    } catch (err) {
      toast.error(err.response?.data || 'Unable to load course topics');
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function startEdit(question) {
    setEditingQuestionId(question.id);
    setForm({
      topicId: question.topicId || '',
      question: question.question,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      correctAnswer: question.correctAnswer || 'A'
    });
  }

  function resetForm() {
    setEditingQuestionId(null);
    setForm(emptyQuestion);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    try {
      if (editingQuestionId) {
        await updateQuestion(editingQuestionId, form);
        toast.success('Quiz question updated');
      } else {
        await addTopicQuestion(form.topicId, form);
        toast.success('Quiz question added');
      }
      resetForm();
      await loadQuestions();
    } catch (err) {
      toast.error(err.response?.data || 'Unable to save quiz question');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(questionId) {
    if (!window.confirm('Delete this quiz question?')) {
      return;
    }

    try {
      await deleteQuestion(questionId);
      toast.success('Quiz question deleted');
      await loadQuestions();
    } catch (err) {
      toast.error(err.response?.data || 'Unable to delete quiz question');
    }
  }

  return (
    <AdminLayout>
      <div className="page-stack admin-page">
        <section className="admin-section-hero">
          <span className="eyebrow">Quiz management</span>
          <h2>Create topic-wise quiz questions.</h2>
          <p>Questions are attached to a topic so students can attempt quizzes from the correct learning path.</p>
        </section>

        <section className="admin-grid">
          <div className="panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Quizzes</span>
                <h2>{editingQuestionId ? 'Update Question' : 'Add Quiz Question'}</h2>
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
              <label>
                Topic
                <select name="topicId" value={form.topicId} onChange={handleChange} required>
                  <option value="">Select topic</option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>{topic.title}</option>
                  ))}
                </select>
              </label>
              <label>Question<textarea name="question" value={form.question} onChange={handleChange} rows="3" required /></label>
              <div className="admin-options-grid">
                <label>Option A<input name="optionA" value={form.optionA} onChange={handleChange} required /></label>
                <label>Option B<input name="optionB" value={form.optionB} onChange={handleChange} required /></label>
                <label>Option C<input name="optionC" value={form.optionC} onChange={handleChange} required /></label>
                <label>Option D<input name="optionD" value={form.optionD} onChange={handleChange} required /></label>
              </div>
              <label>
                Correct Answer
                <select name="correctAnswer" value={form.correctAnswer} onChange={handleChange}>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </label>
              <div className="form-actions">
                <button className="primary-button" type="submit" disabled={saving || !form.topicId}>
                  {saving ? <LoadingSpinner label="Saving..." /> : (editingQuestionId ? 'Update Question' : 'Add Question')}
                </button>
                {editingQuestionId && <button className="secondary-button" type="button" onClick={resetForm}>Cancel</button>}
              </div>
            </form>
          </div>

          <div className="panel">
            <h2>Quiz Questions</h2>
            {loading ? (
              <LoadingSpinner label="Loading questions..." />
            ) : questions.length === 0 ? (
              <EmptyState icon={<FiFileText />} title="No questions" message="Add quiz questions for a topic." />
            ) : (
              <div className="admin-list">
                {questions.map((question) => (
                  <article className="admin-list-item" key={question.id}>
                    <div>
                      <h3>{question.topicTitle || 'Topic question'}</h3>
                      <p>{question.question}</p>
                    </div>
                    <div className="item-actions">
                      <button className="secondary-button compact" type="button" onClick={() => startEdit(question)}><FiEdit2 /> Edit</button>
                      <button className="danger-button compact" type="button" onClick={() => handleDelete(question.id)}><FiTrash2 /> Delete</button>
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

export default ManageQuizzes;
