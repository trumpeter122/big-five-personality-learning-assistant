import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import {
  getLearningPlaybook,
  getLevelText,
  getTraitNames,
  getResultText,
  mapScoresToResults,
  traitTones
} from '../assessment';
import { traitIcons, CloseIcon } from '../components/icons';
import { getStudyCards } from '../data/cards';
import { useCopy } from '../hooks/useCopy';
import { exportReportPdf } from '../utils/exportReport';
import { processAnswers } from '../../docs/packages/score/src/index.ts';

const domainParamMap = {
  openness: 'O',
  conscientiousness: 'C',
  extraversion: 'E',
  agreeableness: 'A',
  neuroticism: 'N'
};

const reverseDomainParamMap = Object.fromEntries(
  Object.entries(domainParamMap).map(([key, value]) => [value, key])
);

const buildReportFromScores = (scoreMap) => {
  const entries = Object.entries(scoreMap)
    .filter(([, val]) => !Number.isNaN(Number(val)))
    .map(([domain, score]) => ({ domain, score: Number(score) }));
  if (!entries.length) return null;
  const scores = processAnswers(entries);
  const generated = mapScoresToResults(scores);
  return { scores, generated };
};

const parseQueryScores = (search) => {
  const params = new URLSearchParams(search || '');
  const result = {};
  let hasAny = false;
  Object.entries(domainParamMap).forEach(([param, domain]) => {
    const raw = params.get(param);
    if (raw == null) return;
    const num = Number(raw);
    if (Number.isNaN(num)) return;
    result[domain] = num;
    hasAny = true;
  });
  return hasAny ? result : null;
};

const buildShareSearch = (report) => {
  const params = new URLSearchParams();
  Object.entries(report.scores || {}).forEach(([domain, data]) => {
    const param = reverseDomainParamMap[domain];
    if (!param || !data) return;
    const avg = data.count ? data.score / data.count : data.score;
    params.set(param, (avg || 0).toFixed(2));
  });
  return params.toString();
};

function ResultsPage() {
  const { report, resetAll, uiLanguage, setReport } = useAssessment();
  const navigate = useNavigate();
  const location = useLocation();
  const c = useCopy();
  const [toast, setToast] = useState(null);
  const [drawn, setDrawn] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [tone, setTone] = useState(null);
  const [ripple, setRipple] = useState(null);
  const rippleTimeoutRef = useRef(null);
  const defaultVarsRef = useRef(null);
  const playbook = useMemo(() => getLearningPlaybook(uiLanguage), [uiLanguage]);
  const levelLabels = useMemo(() => getLevelText(uiLanguage), [uiLanguage]);
  const cardsByLanguage = useMemo(() => getStudyCards(uiLanguage), [uiLanguage]);

  const captureDefaultVars = () => {
    if (defaultVarsRef.current) return;
    const styles = getComputedStyle(document.documentElement);
    defaultVarsRef.current = {
      accent: styles.getPropertyValue('--accent'),
      accent2: styles.getPropertyValue('--accent-2'),
      pill: styles.getPropertyValue('--pill')
    };
  };

  const applyTone = (domain, evt) => {
    const theme = traitTones[domain];
    if (!theme) return;
    captureDefaultVars();
    if (rippleTimeoutRef.current) {
      clearTimeout(rippleTimeoutRef.current);
      rippleTimeoutRef.current = null;
    }
    document.documentElement.style.setProperty('--accent', theme.accent);
    document.documentElement.style.setProperty('--accent-2', theme.accent2);
    document.documentElement.style.setProperty('--pill', theme.pill);
    setTone(domain);
    if (evt) {
      const margin = 80;
      const vw = window.innerWidth || 1200;
      const vh = window.innerHeight || 800;
      let x = evt.clientX;
      let y = evt.clientY;
      const pushToEdge = (value, size) => {
        if (value < size / 2) return margin;
        if (value > size / 2) return size - margin;
        return value;
      };
      x = pushToEdge(x, vw);
      y = pushToEdge(y, vh);
      setRipple({
        x,
        y,
        color: theme.accent,
        active: true
      });
    }
  };

  const clearTone = () => {
    if (defaultVarsRef.current) {
      document.documentElement.style.setProperty('--accent', defaultVarsRef.current.accent);
      document.documentElement.style.setProperty('--accent-2', defaultVarsRef.current.accent2);
      document.documentElement.style.setProperty('--pill', defaultVarsRef.current.pill);
    }
    setTone(null);
    setRipple((prev) => (prev ? { ...prev, active: false } : null));
    if (rippleTimeoutRef.current) {
      clearTimeout(rippleTimeoutRef.current);
    }
    rippleTimeoutRef.current = setTimeout(() => {
      setRipple(null);
      rippleTimeoutRef.current = null;
    }, 420);
  };

  useEffect(() => {
    if (report) return;
    const parsed = parseQueryScores(location.search);
    if (!parsed) return;
    const next = buildReportFromScores(parsed);
    if (next) {
      setReport(next);
    }
  }, [report, location.search, setReport]);

  useEffect(() => {
    if (!report) return;
    const nextSearch = buildShareSearch(report);
    const currentSearch = (location.search || '').replace(/^\?/, '');
    if (nextSearch && nextSearch !== currentSearch) {
      navigate({ pathname: '/results', search: `?${nextSearch}` }, { replace: true });
    }
  }, [report, location.search, navigate]);

  useEffect(
    () => () => {
      clearTone();
      if (rippleTimeoutRef.current) {
        clearTimeout(rippleTimeoutRef.current);
      }
    },
    []
  );

  const hasReport = !!report;

  const deck = useMemo(() => {
    if (!report?.generated) return [];
    return report.generated.flatMap((item) => {
      const level = report.scores[item.domain]?.result || 'neutral';
      const cards = cardsByLanguage[item.domain]?.[level] || [];
      return cards.map((text) => ({
        domain: item.domain,
        level,
        text
      }));
    });
  }, [report, cardsByLanguage]);

  useEffect(() => {
    setDrawn(null);
    setShowModal(false);
  }, [uiLanguage]);

  const drawCard = () => {
    if (!deck.length) return;
    const pick = deck[Math.floor(Math.random() * deck.length)];
    setDrawn({ ...pick, id: `${pick.domain}-${Math.random()}` });
    setShowModal(true);
  };

  const handleExport = () => {
    if (!report) return;
    setIsExporting(true);
    const ok = exportReportPdf(report, c, uiLanguage, playbook);
    if (!ok) {
      window.alert?.(c.exportPdfError);
    }
    setTimeout(() => setIsExporting(false), 400);
  };

  const handleCopyLink = async () => {
    if (!report) return;
    const search = buildShareSearch(report);
    const url = `${window.location.origin}/results${search ? `?${search}` : ''}`;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setToast(c.shareCopied);
      } else {
        throw new Error('clipboard unavailable');
      }
    } catch (err) {
      console.error(err);
      setToast(c.shareCopyFailed);
    }
    setTimeout(() => setToast(null), 2000);
  };

  if (!hasReport) {
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

  return (
    <section className="card panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">{c.resultsTitle}</p>
          <h2>{c.resultsSubtitle}</h2>
        </div>
        <div className="pill accent">{c.reportReady}</div>
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
                <span className={`level ${drawn.level}`}>{levelLabels[drawn.level]}</span>
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
                {(() => {
                  const names = getTraitNames(drawn.domain, uiLanguage);
                  return (
                    <div className="card-emblem" title={names.main}>
                      {traitIcons[drawn.domain] && (() => {
                        const Icon = traitIcons[drawn.domain];
                        return <Icon />;
                      })()}
                    </div>
                  );
                })()}
                <div className="card-meta">
                  {(() => {
                    const names = getTraitNames(drawn.domain, uiLanguage);
                    return (
                      <>
                        <p className="card-title">{names.main}</p>
                        <p className="card-sub">{levelLabels[drawn.level]}</p>
                      </>
                    );
                  })()}
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
            </div>
          </div>
        </div>
      )}

      <div className="result-grid">
        {report.generated.map((item) => {
          const level = report.scores[item.domain]?.result || 'neutral';
          const strategies = playbook[item.domain]?.[level] || [];
          const Icon = traitIcons[item.domain];
          const names = getTraitNames(item.domain, uiLanguage);
          const scoreText = getResultText(item.domain, level, uiLanguage, item.scoreText || '');

          return (
            <div
              key={item.domain}
              className="result-card"
              onMouseEnter={(e) => applyTone(item.domain, e)}
              onMouseLeave={clearTone}
            >
              <div className="result-head">
                <div
                  className="pill muted"
                  title={names.alt}
                  aria-label={names.alt}
                >
                  {Icon && <Icon />}
                </div>
                <div className={`level ${level}`}>{levelLabels[level]}</div>
              </div>
              <p className="result-title">{names.main}</p>
              <p className="result-text" dangerouslySetInnerHTML={{ __html: scoreText }} />
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
        <div className="panel-cta" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="primary" onClick={handleExport} disabled={isExporting}>
            {isExporting ? c.exportingPdf : c.exportPdf}
          </button>
          <button className="ghost" onClick={handleCopyLink}>
            {c.shareLink}
          </button>
          <p className="hint">{c.exportPdfHint}</p>
        </div>
        <div className="panel-cta">
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
      </div>
      {ripple && (
        <div
          className={`tone-overlay${tone ? ' active' : ''}`}
          style={{
            '--tone-x': `${ripple.x}px`,
            '--tone-y': `${ripple.y}px`,
            '--tone-color': ripple.color
          }}
        />
      )}
      {toast && <div className="toast">{toast}</div>}
    </section>
  );
}

export default ResultsPage;
