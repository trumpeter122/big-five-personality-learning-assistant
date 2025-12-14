import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import {
  getLearningPlaybook,
  getLevelText,
  getTraitNames,
  getResultText,
  traitTones,
  getLocaleBundle
} from '../assessment';
import { traitIcons, CloseIcon } from '../components/icons';
import { useCopy } from '../hooks/useCopy';
import { exportReportPdf } from '../utils/exportReport';
import { useToneRipple } from '../hooks/useToneRipple';
import { buildReportFromScores, parseQueryScores, buildShareSearch } from '../utils/reportShare';
import type { TraitKey, Level, Report, CardsDeck } from '../types';

type DeckCard = { domain: TraitKey; level: Level; text: string; id?: string };

function ResultsPage() {
  const { report, resetAll, uiLanguage, setReport } = useAssessment();
  const navigate = useNavigate();
  const location = useLocation();
  const c = useCopy();
  const [toast, setToast] = useState<string | null>(null);
  const [drawn, setDrawn] = useState<DeckCard | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { ripple, applyTone, clearTone } = useToneRipple(traitTones);
  const localeBundle = useMemo(() => getLocaleBundle(uiLanguage), [uiLanguage]);
  const playbook = useMemo(() => getLearningPlaybook(uiLanguage), [uiLanguage]);
  const levelLabels = useMemo(() => getLevelText(uiLanguage), [uiLanguage]);
  const cardsByLanguage = useMemo<CardsDeck>(() => localeBundle.cards || ({} as CardsDeck), [localeBundle]);

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

  const hasReport = !!report;

  const deck = useMemo(() => {
    if (!report?.generated) return [];
    return report.generated.flatMap((item) => {
      const level = (report.scores[item.domain as TraitKey]?.result || 'neutral') as Level;
      const cards = cardsByLanguage[item.domain as TraitKey]?.[level] || [];
      return cards.map((text) => ({
        domain: item.domain as TraitKey,
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
    const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
    const url = `${window.location.origin}${base}/results${search ? `?${search}` : ''}`;
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
          className={`tone-overlay${ripple.active ? ' active' : ''}`}
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
