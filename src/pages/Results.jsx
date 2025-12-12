import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { learningPlaybook, levelText, traitLabels } from '../assessment';
import { traitIcons, CloseIcon } from '../components/icons';
import { studyCards } from '../data/cards';

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
          <p className="eyebrow">学习策略与人格反馈</p>
          <h2>个性化建议</h2>
        </div>
        <div className="pill accent">已生成</div>
      </div>

      <div className="gacha">
        <div className="gacha-head">
          <div>
            <p className="eyebrow">抽卡系统</p>
            <h3>随机学习行动卡</h3>
            <p className="hint">根据你的人格结果随机抽取一张任务卡，增加趣味和执行力。</p>
          </div>
          <button className="primary" onClick={drawCard} disabled={!deck.length}>
            抽一张
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
            <p className="hint">点击「抽一张」从你的专属卡组抽取行动建议。</p>
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
                <p className="label">今日抽卡任务</p>
                <p className="modal-text">{drawn.text}</p>
                <p className="hint">再次点击「抽一张」可获得不同的行动卡。</p>
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
