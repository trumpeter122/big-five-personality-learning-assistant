import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../App';
import { learningPlaybook, levelText, traitLabels } from '../assessment';

function ResultsPage() {
  const { report, resetAll } = useAssessment();
  const navigate = useNavigate();

  if (!report) {
    return (
      <section className="card panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">学习策略与人格反馈</p>
            <h2>等待生成报告</h2>
          </div>
        </div>
        <div className="placeholder">
          <p>先完成 120 题测试，或在「直接输入」录入你的 Big Five 分数。</p>
          <div className="panel-cta" style={{ marginTop: '10px' }}>
            <button
              className="primary"
              onClick={() => {
                resetAll();
                navigate('/test');
              }}
            >
              前往严谨测试
            </button>
            <button
              className="ghost"
              onClick={() => {
                resetAll();
                navigate('/manual');
              }}
            >
              我已知分数
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
          <p className="eyebrow">学习策略与人格反馈</p>
          <h2>个性化建议</h2>
        </div>
        <div className="pill accent">已生成</div>
      </div>

      <div className="result-grid">
        {report.generated.map((item) => {
          const level = report.scores[item.domain]?.result || 'neutral';
          const strategies = learningPlaybook[item.domain]?.[level] || [];
          return (
            <div key={item.domain} className="result-card">
              <div className="result-head">
                <div className="pill muted">{traitLabels[item.domain].zh}</div>
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
                <p className="label">学习策略</p>
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
          重新测试
        </button>
        <button
          className="ghost"
          onClick={() => {
            resetAll();
            navigate('/manual');
          }}
        >
          录入新的自评
        </button>
      </div>
    </section>
  );
}

export default ResultsPage;
