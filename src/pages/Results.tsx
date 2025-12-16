import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
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
import {
  buildCsv,
  emptyTracking,
  loadTracking,
  recordDraw,
  importTrackingFromCsv,
  resetTracking,
  saveTracking,
  setEntryCompletion,
  type TrackingState
} from '../utils/tracking';
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
  const [tracking, setTracking] = useState<TrackingState>(emptyTracking);
  const [showAllEntries, setShowAllEntries] = useState(false);
  const { ripple, applyTone, clearTone } = useToneRipple(traitTones);
  const gachaBodyRef = useRef<HTMLDivElement | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const localeBundle = useMemo(() => getLocaleBundle(uiLanguage), [uiLanguage]);
  const playbook = useMemo(() => getLearningPlaybook(uiLanguage), [uiLanguage]);
  const levelLabels = useMemo(() => getLevelText(uiLanguage), [uiLanguage]);
  const cardsByLanguage = useMemo<CardsDeck>(() => localeBundle.cards || ({} as CardsDeck), [localeBundle]);
  const entriesToShow = useMemo(
    () => (showAllEntries ? tracking.entries : tracking.entries.slice(0, 5)),
    [tracking.entries, showAllEntries]
  );

  useEffect(() => {
    setTracking(loadTracking());
  }, []);

  const updateTracking = (updater: (state: TrackingState) => TrackingState) => {
    setTracking((prev) => {
      const next = updater(prev);
      saveTracking(next);
      return next;
    });
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
    const stamp = Date.now();
    const entryId = `${pick.domain}-${stamp}`;
    const rect = gachaBodyRef.current?.getBoundingClientRect();
    const pulseOrigin = rect
      ? { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 }
      : undefined;

    setDrawn({ ...pick, id: entryId });
    applyTone(pick.domain, pulseOrigin);
    updateTracking((state) =>
      recordDraw(state, {
        id: entryId,
        trait: pick.domain,
        level: pick.level,
        text: pick.text,
        drawnAt: stamp
      })
    );
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
    const basePath = (import.meta.env.BASE_URL || '').replace(/\/+$/, '');
    const url = `${window.location.origin}${basePath}/results${search ? `?${search}` : ''}`;
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

  const handleToggleCompletion = (entryId: string, completed: boolean) => {
    updateTracking((state) => setEntryCompletion(state, entryId, completed));
  };

  const handleExportLog = () => {
    if (!tracking.entries.length) return;
    const csv = buildCsv(tracking.entries);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gacha-log.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 400);
  };

  const handleResetTracking = () => {
    if (!tracking.entries.length) return;
    if (!window.confirm(c.trackerResetConfirm)) return;
    updateTracking(() => resetTracking());
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImportFile = (evt: ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || '');
        const imported = importTrackingFromCsv(text);
        if (!imported.entries.length) {
          throw new Error('empty');
        }
        setTracking(imported);
        saveTracking(imported);
        setToast(c.trackerImportDone);
      } catch (err) {
        console.error(err);
        setToast(c.trackerImportFailed);
      } finally {
        evt.target.value = '';
      }
    };
    reader.readAsText(file);
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
            <p className="hint gacha-hint">{c.gachaHint}</p>
          </div>
          <div className="gacha-actions">
            <button className="primary" onClick={drawCard} disabled={!deck.length}>
              {c.draw}
            </button>
            <span className="pill soft">{c.gachaToday}</span>
          </div>
        </div>
        <div className="gacha-body" ref={gachaBodyRef}>
          {drawn ? (
            <div className="gacha-card" key={drawn.id}>
              <div className="gacha-meta">
                {(() => {
                  const names = getTraitNames(drawn.domain, uiLanguage);
                  const Icon = traitIcons[drawn.domain];
                  return (
                    <span className="gacha-pill">
                      {Icon && <Icon />}
                      {names.main}
                    </span>
                  );
                })()}
                <span className={`level ${drawn.level}`}>{levelLabels[drawn.level]}</span>
              </div>
              <p className="gacha-text">{drawn.text}</p>
            </div>
          ) : (
            <div className="gacha-placeholder">
              <p className="hint">{c.gachaEmpty}</p>
            </div>
          )}
        </div>
      </div>

      <div className="gacha-tracker">
        <div className="tracker-head">
          <div>
            <p className="eyebrow">{c.trackerTitle}</p>
            <p className="hint">{c.trackerHint}</p>
          </div>
          <div className="tracker-stats">
            <span className="pill soft">
              {c.trackerCurrent}: {tracking.streak.current || 0}d
            </span>
            <span className="pill soft">
              {c.trackerLongest}: {tracking.streak.longest || 0}d
            </span>
          </div>
        </div>
        <div className="tracker-list">
          {entriesToShow.length ? (
            entriesToShow.map((entry) => {
              const names = getTraitNames(entry.trait, uiLanguage);
              const Icon = traitIcons[entry.trait];
              return (
                <div className="tracker-item" key={entry.id}>
                  <label className="tracker-check">
                    <input
                      type="checkbox"
                      checked={!!entry.completedAt}
                      onChange={(e) => handleToggleCompletion(entry.id, e.target.checked)}
                    />
                    <span>{c.trackerMarkDone}</span>
                  </label>
                  <div className="tracker-detail">
                    <div className="tracker-row">
                      <span className="gacha-pill">
                        {Icon && <Icon />}
                        {names.main}
                      </span>
                      <span className={`level ${entry.level}`}>{levelLabels[entry.level]}</span>
                    </div>
                    <p className="tracker-text">{entry.text}</p>
                    <div className="tracker-meta">
                      <span className="hint">{new Date(entry.drawnAt).toLocaleDateString()}</span>
                      {entry.completedAt && <span className="tracker-tag">{c.trackerLogged}</span>}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="hint">{c.trackerEmpty}</p>
          )}
        </div>
        {tracking.entries.length > 5 && (
          <button className="ghost" onClick={() => setShowAllEntries((prev) => !prev)}>
            {showAllEntries ? c.trackerCollapse : c.trackerShowAll}
          </button>
        )}
        <div className="tracker-actions">
          <input
            ref={importInputRef}
            type="file"
            accept=".csv,text/csv"
            style={{ display: 'none' }}
            onChange={handleImportFile}
          />
          <button className="ghost" onClick={handleImportClick}>
            {c.trackerImport}
          </button>
          <button className="ghost" onClick={handleExportLog} disabled={!tracking.entries.length}>
            {c.trackerExport}
          </button>
          <button className="ghost" onClick={handleResetTracking} disabled={!tracking.entries.length}>
            {c.trackerReset}
          </button>
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
                {/* <p className="hint">{c.gachaHint}</p> */}
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
            // onMouseEnter={(e) => applyTone(item.domain, e)}
            // onMouseLeave={clearTone}
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
