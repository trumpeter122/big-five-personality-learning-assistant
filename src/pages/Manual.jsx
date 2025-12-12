import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { traitLabels } from '../assessment';
import { traitIcons } from '../components/icons';

function ManualPage() {
  const { manualScores, setManualScores, submitManual, resetAll } = useAssessment();
  const navigate = useNavigate();

  const handleSubmit = () => {
    submitManual();
    navigate('/results');
  };

  return (
    <section className="card panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">直接输入 Big Five</p>
          <h2>已知人格轮廓 → 生成策略</h2>
          <p className="hint">按 1~5 自评或录入已有测评结果；可输入 0.5 步长。</p>
        </div>
      </div>

      <div className="manual-grid">
        {Object.entries(traitLabels).map(([key, meta]) => (
          <div key={key} className="manual-card">
            <div className="manual-head">
              <div className="pill muted" title={meta.zh} aria-label={meta.zh}>
                {traitIcons[key] && (() => {
                  const Icon = traitIcons[key];
                  return <Icon />;
                })()}
              </div>
              <span className="score">{manualScores[key]}</span>
            </div>
            <p className="tone">
              {meta.en} · {meta.tone}
            </p>
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={manualScores[key]}
              onChange={(e) => setManualScores((prev) => ({ ...prev, [key]: Number(e.target.value) }))}
            />
            <p className="hint">1=低特质，5=高特质。保持与你熟悉的测评一致。</p>
          </div>
        ))}
        <div className="manual-actions">
          <button
            className="ghost"
            onClick={() => {
              resetAll();
              navigate('/test');
            }}
          >
            回到严谨测试
          </button>
          <button className="primary" onClick={handleSubmit}>
            生成学习策略
          </button>
        </div>
      </div>
    </section>
  );
}

export default ManualPage;
