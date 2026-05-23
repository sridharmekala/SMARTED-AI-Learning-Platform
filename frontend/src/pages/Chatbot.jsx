import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMessageCircle, FiSend, FiTrash2, FiUser } from 'react-icons/fi';
import EmptyState from '../components/ui/EmptyState.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { clearChatHistory, getChatHistory, sendChatMessage } from '../services/chatService';
import { logoutUser } from '../services/authService';

function Chatbot() {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [historyLoading, setHistoryLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState('');
  const [level, setLevel] = useState('');

  useEffect(() => {
    async function loadHistory() {
      try {
        const history = await getChatHistory();
        setMessages(history.flatMap((item) => [
          {
            role: 'user',
            text: item.question,
            createdAt: item.createdAt
          },
          {
            role: 'bot',
            text: item.answer,
            model: item.model,
            createdAt: item.createdAt
          }
        ]));

        if (history.length > 0) {
          setLevel(history[history.length - 1].level);
        }
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          logoutUser('student');
          navigate('/login');
          return;
        }

        toast.error(err.response?.data || 'Unable to load chat history.');
      } finally {
        setHistoryLoading(false);
      }
    }

    loadHistory();
  }, [navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmedInput = input.trim();

    if (!trimmedInput) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        role: 'user',
        text: trimmedInput
      }
    ]);
    setInput('');
    setError('');
    setLoading(true);

    try {
      const response = await sendChatMessage(trimmedInput);
      setLevel(response.level);
      setMessages((current) => [
        ...current,
        {
          role: 'bot',
          text: response.reply,
          model: response.model,
          createdAt: new Date().toISOString()
        }
      ]);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        logoutUser('student');
        navigate('/login');
        return;
      }

      const message = err.response?.data || 'Unable to get chatbot response.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleClearHistory() {
    const confirmed = window.confirm('Clear your complete chat history?');

    if (!confirmed) {
      return;
    }

    setClearing(true);
    setError('');

    try {
      await clearChatHistory();
      setMessages([]);
      toast.success('Chat history cleared');
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        logoutUser('student');
        navigate('/login');
        return;
      }

      const message = err.response?.data || 'Unable to clear chat history.';
      setError(message);
      toast.error(message);
    } finally {
      setClearing(false);
    }
  }

  return (
    <section className="panel chat-page">
      <div className="chat-header">
        <div>
          <span className="eyebrow">AI tutor</span>
          <h1>AI Tutor</h1>
          <p>{level ? `Answer style: ${level}` : 'Ask doubts about Java, DBMS, Spring Boot, React, or programming basics.'}</p>
        </div>
        <div className="chat-status">
          <FiMessageCircle aria-hidden="true" />
          Online
        </div>
      </div>

      <div className="chat-toolbar">
        <span>{messages.length > 0 ? `${Math.ceil(messages.length / 2)} saved conversations` : 'No saved conversations yet'}</span>
        <button className="danger-button compact" type="button" onClick={handleClearHistory} disabled={clearing || messages.length === 0}>
          {clearing ? <LoadingSpinner label="Clearing..." /> : (
            <>
              <FiTrash2 aria-hidden="true" />
              Clear History
            </>
          )}
        </button>
      </div>

      <div className="chat-window">
        {historyLoading ? (
          <LoadingSpinner label="Loading chat history..." />
        ) : messages.length === 0 && !loading ? (
          <EmptyState
            icon={<FiMessageCircle />}
            title="Start a new tutor chat"
            message="Ask a programming question and SMARTED will save the question and answer here."
          />
        ) : (
          messages.map((message, index) => (
            <article className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
              <span className="message-avatar">
                {message.role === 'bot' ? <FiMessageCircle /> : <FiUser />}
              </span>
              <div className="chat-bubble">
                <p>{message.text}</p>
                {(message.model || message.createdAt) && (
                  <span>
                    {message.model ? `${message.model} · ` : ''}
                    {message.createdAt ? new Date(message.createdAt).toLocaleString() : ''}
                  </span>
                )}
              </div>
            </article>
          ))
        )}

        {loading && (
          <article className="chat-message bot">
            <span className="message-avatar"><FiMessageCircle /></span>
            <div className="chat-bubble">
              <LoadingSpinner label="Thinking..." />
            </div>
          </article>
        )}
        <div ref={chatEndRef} />
      </div>

      {error && <p className="error-text">{error}</p>}

      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask a programming question..."
          disabled={loading || historyLoading}
        />
        <button className="primary-button" type="submit" disabled={loading || historyLoading || !input.trim()}>
          <FiSend aria-hidden="true" />
          Send
        </button>
      </form>
    </section>
  );
}

export default Chatbot;
