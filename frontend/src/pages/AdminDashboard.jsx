import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiBookOpen, FiEdit2, FiPlus, FiTrash2, FiUsers } from 'react-icons/fi';
import EmptyState from '../components/ui/EmptyState.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import {
  addCourse,
  addCourseTopic,
  addQuizQuestion,
  deleteCourse,
  deleteTopic,
  getAdminCourses,
  getAdminCourseTopics,
  getAdminQuizQuestions,
  getStudents,
  updateCourse,
  updateTopic
} from '../services/adminService';

const emptyCourse = {
  name: '',
  description: ''
};

const emptyTopic = {
  title: '',
  description: '',
  content: '',
  difficulty: 'Beginner',
  estimatedTimeMinutes: 45
};

const emptyQuestion = {
  topicId: '',
  question: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctAnswer: 'A'
};

function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [students, setStudents] = useState([]);
  const [courseForm, setCourseForm] = useState(emptyCourse);
  const [topicForm, setTopicForm] = useState(emptyTopic);
  const [questionForm, setQuestionForm] = useState(emptyQuestion);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingCourse, setSavingCourse] = useState(false);
  const [savingTopic, setSavingTopic] = useState(false);
  const [savingQuestion, setSavingQuestion] = useState(false);

  async function loadAdminData() {
    const [courseData, questionData, studentData] = await Promise.all([
      getAdminCourses(),
      getAdminQuizQuestions(),
      getStudents()
    ]);
    const nextCourseId = selectedCourseId || courseData[0]?.id || '';
    const selectedCourse = courseData.find((course) => String(course.id) === String(nextCourseId)) || courseData[0];
    setCourses(courseData);
    setSelectedCourseId(selectedCourse?.id || '');
    const topicData = selectedCourse?.id ? await getAdminCourseTopics(selectedCourse.id) : [];
    setTopics(topicData);
    setQuestions(questionData);
    setStudents(studentData);
  }

  useEffect(() => {
    async function load() {
      try {
        await loadAdminData();
      } catch (err) {
        toast.error(err.response?.data || 'Unable to load admin data');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  useEffect(() => {
    async function loadTopicsForSelectedCourse() {
      if (!selectedCourseId) {
        setTopics([]);
        return;
      }

      try {
        setTopics(await getAdminCourseTopics(selectedCourseId));
      } catch (err) {
        toast.error(err.response?.data || 'Unable to load course topics');
      }
    }

    loadTopicsForSelectedCourse();
  }, [selectedCourseId]);

  function handleCourseChange(event) {
    const { name, value } = event.target;
    setCourseForm((current) => ({ ...current, [name]: value }));
  }

  function handleTopicChange(event) {
    const { name, value } = event.target;
    setTopicForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  function startEditCourse(course) {
    setEditingCourseId(course.id);
    setCourseForm({ name: course.name, description: course.description });
  }

  function resetCourseForm() {
    setEditingCourseId(null);
    setCourseForm(emptyCourse);
  }

  function handleQuestionChange(event) {
    const { name, value } = event.target;
    setQuestionForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  function startEditTopic(topic) {
    setEditingTopicId(topic.id);
    setTopicForm({
      title: topic.title,
      description: topic.description,
      content: topic.content,
      difficulty: topic.difficulty || 'Beginner',
      estimatedTimeMinutes: topic.estimatedTimeMinutes || 45
    });
  }

  function resetTopicForm() {
    setEditingTopicId(null);
    setTopicForm(emptyTopic);
  }

  async function handleCourseSubmit(event) {
    event.preventDefault();
    setSavingCourse(true);

    try {
      if (editingCourseId) {
        await updateCourse(editingCourseId, courseForm);
        toast.success('Course updated');
      } else {
        await addCourse(courseForm);
        toast.success('Course created');
      }
      resetCourseForm();
      await loadAdminData();
    } catch (err) {
      toast.error(err.response?.data || 'Unable to save course');
    } finally {
      setSavingCourse(false);
    }
  }

  async function handleDeleteCourse(courseId) {
    if (!window.confirm('Delete this course with its topics, questions, scores, and progress?')) {
      return;
    }

    try {
      await deleteCourse(courseId);
      toast.success('Course deleted');
      setSelectedCourseId('');
      await loadAdminData();
    } catch (err) {
      toast.error(err.response?.data || 'Unable to delete course');
    }
  }

  async function handleTopicSubmit(event) {
    event.preventDefault();
    setSavingTopic(true);

    try {
      if (editingTopicId) {
        await updateTopic(editingTopicId, topicForm);
        toast.success('Topic updated');
      } else {
        await addCourseTopic(selectedCourseId, topicForm);
        toast.success('Topic added');
      }

      resetTopicForm();
      await loadAdminData();
    } catch (err) {
      toast.error(err.response?.data || 'Unable to save topic');
    } finally {
      setSavingTopic(false);
    }
  }

  async function handleDeleteTopic(topicId) {
    const confirmed = window.confirm('Delete this topic and its quiz questions?');

    if (!confirmed) {
      return;
    }

    try {
      await deleteTopic(topicId);
      toast.success('Topic deleted');
      await loadAdminData();
    } catch (err) {
      toast.error(err.response?.data || 'Unable to delete topic');
    }
  }

  async function handleQuestionSubmit(event) {
    event.preventDefault();
    setSavingQuestion(true);

    try {
      await addQuizQuestion({
        ...questionForm,
        topicId: Number(questionForm.topicId)
      });
      setQuestionForm(emptyQuestion);
      toast.success('Quiz question added');
      await loadAdminData();
    } catch (err) {
      toast.error(err.response?.data || 'Unable to add quiz question');
    } finally {
      setSavingQuestion(false);
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading admin module..." />;
  }

  return (
    <div className="page-stack admin-page">
      <section className="hero-banner compact">
        <div>
          <span className="eyebrow">Admin module</span>
          <h1>Manage SMARTED learning content.</h1>
          <p>Add topics, maintain quiz questions, and monitor student accounts from one workspace.</p>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard icon={<FiBookOpen />} label="Courses" value={courses.length} tone="green" />
        <StatCard icon={<FiBookOpen />} label="Topics" value={topics.length} tone="blue" />
        <StatCard icon={<FiPlus />} label="Quiz Questions" value={questions.length} tone="amber" />
        <StatCard icon={<FiUsers />} label="Students" value={students.length} tone="green" />
      </section>

      <section className="admin-grid">
        <div className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Courses</span>
              <h2>{editingCourseId ? 'Update Course' : 'Create Course'}</h2>
            </div>
          </div>
          <form className="admin-form" onSubmit={handleCourseSubmit}>
            <label>
              Course Name
              <input name="name" value={courseForm.name} onChange={handleCourseChange} placeholder="Python Full Stack Development" required />
            </label>
            <label>
              Description
              <textarea name="description" value={courseForm.description} onChange={handleCourseChange} rows="4" required />
            </label>
            <div className="form-actions">
              <button className="primary-button" type="submit" disabled={savingCourse}>
                {savingCourse ? <LoadingSpinner label="Saving..." /> : (editingCourseId ? 'Update Course' : 'Create Course')}
              </button>
              {editingCourseId && <button className="secondary-button" type="button" onClick={resetCourseForm}>Cancel</button>}
            </div>
          </form>
        </div>

        <div className="panel">
          <h2>All Courses</h2>
          {courses.length === 0 ? (
            <EmptyState icon={<FiBookOpen />} title="No courses" message="Create your first course." />
          ) : (
            <div className="admin-list">
              {courses.map((course) => (
                <article className="admin-list-item" key={course.id}>
                  <div>
                    <h3>{course.name}</h3>
                    <p>{course.totalTopics} topics · {course.description}</p>
                  </div>
                  <div className="item-actions">
                    <button className="secondary-button compact" type="button" onClick={() => setSelectedCourseId(course.id)}>Select</button>
                    <button className="secondary-button compact" type="button" onClick={() => startEditCourse(course)}><FiEdit2 /> Edit</button>
                    <button className="danger-button compact" type="button" onClick={() => handleDeleteCourse(course.id)}><FiTrash2 /> Delete</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="admin-grid">
        <div className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Topics</span>
              <h2>{editingTopicId ? 'Update Topic' : 'Add Topic'}</h2>
            </div>
          </div>

          <form className="admin-form" onSubmit={handleTopicSubmit}>
            <label>
              Course
              <select value={selectedCourseId} onChange={(event) => setSelectedCourseId(event.target.value)} required>
                <option value="">Select course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
            </label>
            <label>
              Title
              <input name="title" value={topicForm.title} onChange={handleTopicChange} required />
            </label>
            <label>
              Description
              <textarea name="description" value={topicForm.description} onChange={handleTopicChange} required rows="3" />
            </label>
            <label>
              Content
              <textarea name="content" value={topicForm.content} onChange={handleTopicChange} required rows="6" />
            </label>
            <div className="admin-options-grid">
              <label>Difficulty<input name="difficulty" value={topicForm.difficulty} onChange={handleTopicChange} required /></label>
              <label>Estimated Time<input type="number" name="estimatedTimeMinutes" value={topicForm.estimatedTimeMinutes} onChange={handleTopicChange} min="1" required /></label>
            </div>
            <div className="form-actions">
              <button className="primary-button" type="submit" disabled={savingTopic}>
                {savingTopic ? <LoadingSpinner label="Saving..." /> : (editingTopicId ? 'Update Topic' : 'Add Topic')}
              </button>
              {editingTopicId && (
                <button className="secondary-button" type="button" onClick={resetTopicForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Quiz questions</span>
              <h2>Add Question</h2>
            </div>
          </div>

          <form className="admin-form" onSubmit={handleQuestionSubmit}>
            <label>
              Topic
              <select name="topicId" value={questionForm.topicId} onChange={handleQuestionChange} required>
                <option value="">Select topic</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>{topic.title}</option>
                ))}
              </select>
            </label>
            <label>
              Question
              <textarea name="question" value={questionForm.question} onChange={handleQuestionChange} required rows="3" />
            </label>
            <div className="admin-options-grid">
              <label>Option A<input name="optionA" value={questionForm.optionA} onChange={handleQuestionChange} required /></label>
              <label>Option B<input name="optionB" value={questionForm.optionB} onChange={handleQuestionChange} required /></label>
              <label>Option C<input name="optionC" value={questionForm.optionC} onChange={handleQuestionChange} required /></label>
              <label>Option D<input name="optionD" value={questionForm.optionD} onChange={handleQuestionChange} required /></label>
            </div>
            <label>
              Correct Answer
              <select name="correctAnswer" value={questionForm.correctAnswer} onChange={handleQuestionChange}>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </label>
            <button className="primary-button" type="submit" disabled={savingQuestion}>
              {savingQuestion ? <LoadingSpinner label="Adding..." /> : 'Add Question'}
            </button>
          </form>
        </div>
      </section>

      <section className="panel">
        <h2>Topics in Selected Course</h2>
        {topics.length === 0 ? (
          <EmptyState icon={<FiBookOpen />} title="No topics" message="Add your first topic using the form above." />
        ) : (
          <div className="admin-list">
            {topics.map((topic) => (
              <article className="admin-list-item" key={topic.id}>
                <div>
                  <h3>{topic.title}</h3>
                  <p>{topic.description}</p>
                </div>
                <div className="item-actions">
                  <button className="secondary-button compact" type="button" onClick={() => startEditTopic(topic)}>
                    <FiEdit2 aria-hidden="true" />
                    Edit
                  </button>
                  <button className="danger-button compact" type="button" onClick={() => handleDeleteTopic(topic.id)}>
                    <FiTrash2 aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <h2>Quiz Questions</h2>
        {questions.length === 0 ? (
          <EmptyState icon={<FiPlus />} title="No questions" message="Add quiz questions for your topics." />
        ) : (
          <div className="table-wrap">
            <table className="score-table">
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Question</th>
                  <th>Answer</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question) => (
                  <tr key={question.id}>
                    <td>{question.topicTitle}</td>
                    <td>{question.question}</td>
                    <td>{question.correctAnswer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel">
        <h2>All Students</h2>
        {students.length === 0 ? (
          <EmptyState icon={<FiUsers />} title="No students" message="Registered students will appear here." />
        ) : (
          <div className="table-wrap">
            <table className="score-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Level</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.userId}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.level}</td>
                    <td>{student.joinedDate ? new Date(student.joinedDate).toLocaleDateString() : 'NA'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
