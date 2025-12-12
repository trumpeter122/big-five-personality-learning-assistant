import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { traitLabels, languageOptions } from '../assessment';
import { traitIcons } from '../components/icons';

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
    setLanguage
  } = useAssessment();
  const navigate = useNavigate();

  const canSubmit = answeredCount === questions.length;

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
          <p className="eyebrow">人格测试</p>
          <h2>Big Five 120 题问卷</h2>
          <p className="hint">每屏 8 题，可随时返回修改。下方语言仅切换题干与选项（界面多语言将另行提供）。</p>
        </div>
        <div className="progress">
          <span>
            完成 {answeredCount}/{questions.length}（Q{questionMeta.rangeStart} - Q{questionMeta.rangeEnd}）
          </span>
          <div className="progress-bar">
            <div style={{ width: `${progress}%` }} />
          </div>
          <div className="language-switch">
            <label className="hint" htmlFor="question-language">题目语言</label>
            <select
              id="question-language"
              className="ghost select"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                resetAll();
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

      <div className="question-list">
        {currentQuestions.map((question) => {
          const selected = answers[question.id]?.score;
          return (
            <div key={question.id} className="question-card">
              <div className="question-meta">
                <span className="pill muted">Q{question.num}</span>
                <span className="pill muted" title={traitLabels[question.domain].zh} aria-label={traitLabels[question.domain].zh}>
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
            上一组
          </button>
          <button
            className="ghost"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            下一组
          </button>
        </div>
        <div className="panel-cta">
          <button
            className="ghost"
            onClick={() => {
              resetAll();
              navigate('/manual');
            }}
          >
            我已知人格，直接输入
          </button>
          <button className="primary" disabled={!canSubmit} onClick={handleSubmit}>
            生成报告
          </button>
        </div>
      </div>
      {!canSubmit && <p className="hint align-right">需完成全部 120 题以保持严谨性。</p>}
    </section>
  );
}

export default TestPage;
