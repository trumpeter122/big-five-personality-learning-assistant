import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { getTraitLabels } from '../assessment';
import { traitIcons } from '../components/icons';
import { useCopy } from '../hooks/useCopy';

function ManualPage() {
  const { manualScores, setManualScores, submitManual, resetAll, uiLanguage, setTestMode } = useAssessment();
  const c = useCopy();
  const navigate = useNavigate();
  const traitLabels = getTraitLabels(uiLanguage);

  const handleSubmit = () => {
    submitManual();
    navigate('/results');
  };

  return (
    <section className="card panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">{c.navManual}</p>
          <h2>{c.manualTitle}</h2>
          <p className="hint">{c.manualHint}</p>
        </div>
      </div>

      <div className="manual-grid">
        {Object.entries(traitLabels).map(([key, meta]) => (
          <div key={key} className="manual-card">
            <div className="manual-head">
              <div className="pill muted" title={meta.name} aria-label={meta.name}>
                {traitIcons[key] && (() => {
                  const Icon = traitIcons[key];
                  return <Icon />;
                })()}
              </div>
              <span className="score">{manualScores[key]}</span>
            </div>
            <p className="tone">{meta.name} · {meta.tone}</p>
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={manualScores[key]}
              onChange={(e) => setManualScores((prev) => ({ ...prev, [key]: Number(e.target.value) }))}
            />
            <p className="hint">{c.manualHint}</p>
          </div>
        ))}
        <div className="manual-actions">
          <button
            className="ghost"
            onClick={() => {
              resetAll();
              setTestMode('full');
              navigate('/test');
            }}
          >
            {c.manualBack}
          </button>
          <button className="primary" onClick={handleSubmit}>
            {c.manualSubmit}
          </button>
        </div>
      </div>
    </section>
  );
}

export default ManualPage;
