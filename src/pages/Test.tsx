import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { getTraitLabels, languageOptions } from '../assessment';
import { traitIcons } from '../components/icons';
import { useCopy } from '../hooks/useCopy';

function TestPage() {
  const {
    questions,
    currentQuestions,
    page,
    setPage,
    totalPages,
    answers,
    selectAnswer,
    answeredCount,
    progress,
    submitTest,
    resetAll,
    language,
    setLanguage,
    uiLanguage,
    testMode,
    setTestMode
  } = useAssessment();
  const navigate = useNavigate();
  const c = useCopy();

  const canSubmit = answeredCount === questions.length;
  const traitLabels = getTraitLabels(uiLanguage);
  const isFullMode = testMode === 'full';

  const handleSubmit = () => {
    if (submitTest()) {
      navigate('/results');
    }
  };

  const questionMeta = useMemo(
    () => ({
      rangeStart: page * 8 + 1,
      rangeEnd: Math.min((page + 1) * 8, questions.length)
    }),
    [page, questions.length]
  );

  return (
    <section className="card panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">{c.navTest}</p>
          <h2>{c.testTitle}</h2>
          <p className="hint">{c.testHint}</p>
        </div>
        <div className="progress">
          <span>
            {answeredCount}/{questions.length} · Q{questionMeta.rangeStart} - Q{questionMeta.rangeEnd}
          </span>
          <div className="progress-bar">
            <div style={{ width: `${progress}%` }} />
          </div>
          <div className="language-switch">
            <label className="hint" htmlFor="question-language">{c.questionLangLabel}</label>
            <select
              id="question-language"
              className="ghost select"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
              }}
            >
              {languageOptions.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mode-switch">
        <p className="eyebrow">{c.testModeLabel}</p>
        <div className="segmented">
          <button
            className={`segment ${isFullMode ? 'active' : ''}`}
            onClick={() => setTestMode('full')}
            aria-pressed={isFullMode}
          >
            <span className="segment-title">{c.testModeFull}</span>
            <p className="hint">{c.testModeFullHint}</p>
          </button>
          <button
            className={`segment ${!isFullMode ? 'active' : ''}`}
            onClick={() => setTestMode('short')}
            aria-pressed={!isFullMode}
          >
            <span className="segment-title">{c.testModeShort}</span>
            <p className="hint">{c.testModeShortHint}</p>
          </button>
        </div>
        <p className="hint">{c.testAccuracyNote}</p>
      </div>

      <div className="question-list">
        {currentQuestions.map((question) => {
          const selected = answers[question.id]?.score;
          return (
            <div key={question.id} className="question-card">
              <div className="question-meta">
                <span className="pill muted">Q{question.num}</span>
                <span className="pill muted" title={traitLabels[question.domain]?.name} aria-label={traitLabels[question.domain]?.name}>
                  {traitIcons[question.domain] && (() => {
                    const Icon = traitIcons[question.domain];
                    return <Icon />;
                  })()}
                </span>
              </div>
              <p className="question-text">{question.text}</p>
              <div className="choices">
                {question.choices.map((choice, index) => (
                  <button
                    key={choice.text + index}
                    className={`choice ${selected === choice.score ? 'active' : ''}`}
                    onClick={() => selectAnswer(question, choice)}
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="panel-actions">
        <div className="nav">
          <button className="ghost" disabled={page === 0} onClick={() => setPage(page - 1)}>
            {c.prev}
          </button>
          <button
            className="ghost"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            {c.next}
          </button>
        </div>
        <div className="panel-cta">
          <button
            className="ghost"
            onClick={() => {
              resetAll();
              setTestMode('full');
              navigate('/manual');
            }}
          >
            {c.startManual}
          </button>
          <button className="primary" disabled={!canSubmit} onClick={handleSubmit}>
            {c.submit}
          </button>
        </div>
      </div>
      {!canSubmit && <p className="hint align-right">{c.testCompleteAll}</p>}
    </section>
  );
}

export default TestPage;
