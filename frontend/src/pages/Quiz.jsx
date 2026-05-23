import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiCheckCircle, FiClipboard, FiTarget } from 'react-icons/fi';
import EmptyState from '../components/ui/EmptyState.jsx';
import LevelBadge from '../components/ui/LevelBadge.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { getQuizByTopicId, submitQuiz } from '../services/quizService';
import { logoutUser } from '../services/authService';

function Quiz() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadQuiz() {
      try {
        const data = await getQuizByTopicId(topicId);
        setQuestions(data);
      } catch (err) {
        setError('Unable to load quiz questions.');
      } finally {
        setLoading(false);
      }
    }

    loadQuiz();
  }, [topicId]);

  function handleAnswerChange(questionId, selectedAnswer) {
    setAnswers((current) => ({
      ...current,
      [questionId]: selectedAnswer
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (Object.keys(answers).length !== questions.length) {
      setError('Please answer all questions before submitting.');
      toast.info('Please answer all questions before submitting.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        topicId: Number(topicId),
        answers: questions.map((question) => ({
          questionId: question.id,
          selectedAnswer: answers[question.id]
        }))
      };
      const data = await submitQuiz(payload);
      setResult(data);
      toast.success('Quiz submitted successfully');
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        logoutUser('student');
        navigate('/login');
        return;
      }

      setError('Unable to submit quiz. Please try again.');
      toast.error('Unable to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading quiz..." />;
  }

  if (result) {
    return (
      <section className="panel result-card">
        <div className="result-icon"><FiCheckCircle /></div>
        <span className="eyebrow">Quiz result</span>
        <h1>Your score is ready</h1>
        <div className="result-score">{result.score}</div>
        <p>
          You answered {result.correctAnswers} out of {result.totalQuestions} questions correctly.
        </p>
        <LevelBadge level={result.level} />
        <div className="result-actions">
          <Link className="primary-link" to="/dashboard">View Dashboard</Link>
          <Link className="secondary-link" to="/topics">Back to Topics</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="quiz-header">
        <div>
          <span className="eyebrow">Knowledge check</span>
          <h1>Quiz</h1>
          <p>Answer every question to submit your attempt.</p>
        </div>
        <Link className="secondary-link" to={`/topics/${topicId}`}>
          <FiArrowLeft aria-hidden="true" />
          Review Topic
        </Link>
      </div>

      {error && <p className="error-text">{error}</p>}

      {questions.length === 0 ? (
        <EmptyState icon={<FiClipboard />} title="No questions found" message="This topic does not have quiz questions yet." />
      ) : (
        <form className="quiz-form" onSubmit={handleSubmit}>
          {questions.map((question, index) => (
            <fieldset className="question-card" key={question.id}>
              <legend>
                <span>{index + 1}</span>
                {question.question}
              </legend>

              {[
                ['A', question.optionA],
                ['B', question.optionB],
                ['C', question.optionC],
                ['D', question.optionD]
              ].map(([optionKey, optionText]) => (
                <label className="option-row" key={optionKey}>
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={optionKey}
                    checked={answers[question.id] === optionKey}
                    onChange={() => handleAnswerChange(question.id, optionKey)}
                  />
                  <span className="option-key">{optionKey}</span>
                  <span>{optionText}</span>
                </label>
              ))}
            </fieldset>
          ))}

          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? <LoadingSpinner label="Submitting..." /> : (
              <>
                <FiTarget aria-hidden="true" />
                Submit Quiz
              </>
            )}
          </button>
        </form>
      )}
    </section>
  );
}

export default Quiz;
