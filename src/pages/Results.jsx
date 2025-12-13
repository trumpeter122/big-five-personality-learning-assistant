import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { learningPlaybook, levelText, traitLabels } from '../assessment';
import { traitIcons, CloseIcon } from '../components/icons';
import { studyCards } from '../data/cards';
import { useCopy } from '../hooks/useCopy';

function ResultsPage() {
  const { report, resetAll } = useAssessment();
  const navigate = useNavigate();
  const c = useCopy();

  if (!report) {
    return (
      <section className="card panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">{c.resultsTitle}</p>
            <h2>{c.resultsSubtitle}</h2>
          </div>
        </div>
        <div className="placeholder">
          <p>{c.noReport}</p>
          <div className="panel-cta" style={{ marginTop: '10px' }}>
            <button
              className="primary"
              onClick={() => {
                resetAll();
                navigate('/test');
              }}
            >
              {c.goTest}
            </button>
            <button
              className="ghost"
              onClick={() => {
                resetAll();
                navigate('/manual');
              }}
            >
              {c.goManual}
            </button>
          </div>
        </div>
      </section>
    );
  }

  const deck = useMemo(() => {
    if (!report?.generated) return [];
    return report.generated.flatMap((item) => {
      const level = report.scores[item.domain]?.result || 'neutral';
      const cards = studyCards[item.domain]?.[level] || [];
      return cards.map((text) => ({
        domain: item.domain,
        level,
        text
      }));
    });
  }, [report]);

  const [drawn, setDrawn] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const drawCard = () => {
    if (!deck.length) return;
    const pick = deck[Math.floor(Math.random() * deck.length)];
    setDrawn({ ...pick, id: `${pick.domain}-${Math.random()}` });
    setShowModal(true);
  };

  return (
    <section className="card panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">{c.resultsTitle}</p>
          <h2>{c.resultsSubtitle}</h2>
        </div>
        <div className="pill accent">已生成</div>
      </div>

      <div className="gacha">
        <div className="gacha-head">
          <div>
            <p className="eyebrow">{c.gachaTitle}</p>
            <h3>{c.gachaSubtitle}</h3>
            <p className="hint">{c.gachaHint}</p>
          </div>
          <button className="primary" onClick={drawCard} disabled={!deck.length}>
            {c.draw}
          </button>
        </div>
        <div className="gacha-body">
          {drawn ? (
            <div className="gacha-card">
              <div className="gacha-meta">
                <div className="pill muted" title={traitLabels[drawn.domain].zh}>
                  {traitIcons[drawn.domain] && (() => {
                    const Icon = traitIcons[drawn.domain];
                    return <Icon />;
                  })()}
                </div>
                <span className={`level ${drawn.level}`}>{levelText[drawn.level]}</span>
              </div>
              <p className="gacha-text">{drawn.text}</p>
            </div>
          ) : (
            <p className="hint">{c.gachaEmpty}</p>
          )}
        </div>
      </div>

      {showModal && drawn && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="card-face">
              <div className="card-top">
                <div className="card-emblem" title={traitLabels[drawn.domain].zh}>
                  {traitIcons[drawn.domain] && (() => {
                    const Icon = traitIcons[drawn.domain];
                    return <Icon />;
                  })()}
                </div>
                <div className="card-meta">
                  <p className="card-title">{traitLabels[drawn.domain].zh}</p>
                  <p className="card-sub">
                    {traitLabels[drawn.domain].en} · {levelText[drawn.level]}
                  </p>
                </div>
                <button className="ghost icon-btn" onClick={() => setShowModal(false)}>
                  <CloseIcon />
                </button>
              </div>
              <div className="modal-body">
                <p className="label">{c.gachaToday}</p>
                <p className="modal-text">{drawn.text}</p>
                <p className="hint">{c.gachaHint}</p>
              </div>
              <div className="card-bottom">
                <span className={`level ${drawn.level}`}>{levelText[drawn.level]}</span>
                <div className="pill muted" title={traitLabels[drawn.domain].zh}>
                  {traitIcons[drawn.domain] && (() => {
                    const Icon = traitIcons[drawn.domain];
                    return <Icon />;
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="result-grid">
        {report.generated.map((item) => {
          const level = report.scores[item.domain]?.result || 'neutral';
          const strategies = learningPlaybook[item.domain]?.[level] || [];
          const Icon = traitIcons[item.domain];

          return (
            <div key={item.domain} className="result-card">
              <div className="result-head">
                <div
                  className="pill muted"
                  title={traitLabels[item.domain].zh}
                  aria-label={traitLabels[item.domain].zh}
                >
                  {Icon && <Icon />}
                </div>
                <div className={`level ${level}`}>{levelText[level]}</div>
              </div>
              <p className="result-title">{item.title}</p>
              <p className="result-text" dangerouslySetInnerHTML={{ __html: item.scoreText || '' }} />
              {item.facets?.length > 0 && (
                <div className="facets">
                  {item.facets.slice(0, 2).map((facet) => (
                    <span key={facet.facet} className="facet-pill">
                      {facet.title}: {facet.scoreText || facet.result}
                    </span>
                  ))}
                </div>
              )}
              <div className="strategy">
                <p className="label">{c.strategyLabel}</p>
                <ul>
                  {strategies.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <div className="panel-actions" style={{ marginTop: '8px' }}>
        <button
          className="ghost"
          onClick={() => {
            resetAll();
            navigate('/test');
          }}
        >
          {c.retest}
        </button>
        <button
          className="ghost"
          onClick={() => {
            resetAll();
            navigate('/manual');
          }}
        >
          {c.reinput}
        </button>
      </div>
    </section>
  );
}

export default ResultsPage;
