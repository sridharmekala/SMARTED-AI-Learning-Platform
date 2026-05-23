import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen } from 'react-icons/fi';
import EmptyState from '../components/ui/EmptyState.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { getCourses } from '../services/progressService';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        setCourses(await getCourses());
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading courses..." />;
  }

  return (
    <div className="page-stack">
      <section className="hero-banner compact">
        <div>
          <span className="eyebrow">My Courses</span>
          <h1>Choose a course and continue learning.</h1>
          <p>Each course has its own topics, quizzes, completed modules, pending modules, and progress percentage.</p>
        </div>
      </section>

      {courses.length === 0 ? (
        <EmptyState icon={<FiBookOpen />} title="No courses available" message="Courses created by admin will appear here." />
      ) : (
        <section className="course-grid">
          {courses.map((course) => (
            <article className="course-card panel" key={course.id}>
              <div className="topic-icon"><FiBookOpen /></div>
              <h2>{course.name}</h2>
              <p>{course.description}</p>
              <div className="progress-summary in-panel">
                <div>
                  <strong>{course.progressPercentage}%</strong>
                  <span>{course.completedTopics} completed · {course.pendingTopics} pending</span>
                </div>
                <div className="progress-track">
                  <span style={{ width: `${course.progressPercentage}%` }} />
                </div>
              </div>
              <Link className="primary-link" to={`/courses/${course.id}`}>Open Course</Link>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default Courses;
