import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiBookOpen, FiFileText, FiHelpCircle, FiLayers, FiSearch } from 'react-icons/fi';
import EmptyState from '../components/ui/EmptyState.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { searchLearningContent } from '../services/searchService';

const groups = [
  { key: 'courses', label: 'Courses', icon: <FiLayers /> },
  { key: 'topics', label: 'Topics', icon: <FiBookOpen /> },
  { key: 'quizQuestions', label: 'Quiz Questions', icon: <FiHelpCircle /> },
  { key: 'learningContent', label: 'Learning Content', icon: <FiFileText /> }
];

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function runSearch() {
      if (initialQuery.trim().length < 2) {
        setResults(null);
        return;
      }

      setLoading(true);
      setError('');
      try {
        setResults(await searchLearningContent(initialQuery.trim()));
      } catch (err) {
        setError('Unable to search right now.');
      } finally {
        setLoading(false);
      }
    }

    runSearch();
  }, [initialQuery]);

  const totalResults = results?.totalResults ?? 0;
  const hasQuery = initialQuery.trim().length >= 2;

  const quickFilters = useMemo(() => ['java', 'spring', 'react', 'mysql', 'jwt'], []);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSearchParams({});
      setResults(null);
      return;
    }

    setSearchParams({ q: trimmed });
  }

  function applyQuickSearch(value) {
    setQuery(value);
    setSearchParams({ q: value });
  }

  return (
    <div className="page-stack">
      <section className="hero-banner compact">
        <div>
          <span className="eyebrow">Search learning workspace</span>
          <h1>Find courses, topics, quizzes, and content.</h1>
          <p>Search across your course catalog, topic descriptions, quiz questions, and learning material.</p>

          <form className="search-hero-form" onSubmit={handleSubmit}>
            <div className="search-input-shell">
              <FiSearch aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search Java, Spring Boot, JWT, React..."
              />
            </div>
            <button className="primary-button" type="submit">Search</button>
          </form>

          <div className="quick-searches">
            {quickFilters.map((item) => (
              <button key={item} type="button" onClick={() => applyQuickSearch(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <LoadingSpinner label="Searching..." />
      ) : error ? (
        <EmptyState icon={<FiSearch />} title="Search unavailable" message={error} />
      ) : !hasQuery ? (
        <EmptyState icon={<FiSearch />} title="Start searching" message="Enter at least two characters to search learning content." />
      ) : totalResults === 0 ? (
        <EmptyState icon={<FiSearch />} title="No results found" message={`No results matched “${initialQuery}”. Try another keyword.`} />
      ) : (
        <section className="search-results">
          <div className="section-heading">
            <h2>{totalResults} results for “{results.query}”</h2>
          </div>

          {groups.map((group) => {
            const items = results[group.key] || [];
            if (items.length === 0) {
              return null;
            }

            return (
              <div className="search-group panel" key={group.key}>
                <div className="section-heading">
                  <h2>{group.label}</h2>
                  <span className="topic-status saved">{items.length}</span>
                </div>

                <div className="search-result-list">
                  {items.map((item) => (
                    <article className="search-result-item" key={`${item.type}-${item.id}-${item.actionUrl}`}>
                      <div className="topic-icon">{group.icon}</div>
                      <div>
                        <span className="eyebrow">{item.type}</span>
                        <h3>{item.title}</h3>
                        <p>{item.matchedText || item.description}</p>
                      </div>
                      <Link className="secondary-link" to={item.actionUrl}>Open</Link>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}

export default Search;
