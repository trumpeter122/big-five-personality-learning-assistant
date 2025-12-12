import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';

function Home() {
  const { resetAll } = useAssessment();
  const navigate = useNavigate();

  const goTest = () => {
    resetAll();
    navigate('/test');
  };

  const goManual = () => {
    resetAll();
    navigate('/manual');
  };

  return (
    <>
      <section className="card hero">
        <div>
          <div className="badge-row">
            <span className="pill soft">严谨测评 · Johnson IPIP NEO-PI-R</span>
            <span className="pill soft">学习风格适配</span>
            <span className="pill soft">多端响应</span>
          </div>
          <p className="hero-text">
            完成官方 120 题人格测试，或直接输入你熟悉的 Big Five 轮廓。系统将基于人格高低分，映射专属学习节奏、协作方式与复习仪式。
          </p>
          <div className="cta-row">
            <button className="primary" onClick={goTest}>
              开始严谨人格测试
            </button>
            <button className="ghost" onClick={goManual}>
              我已知人格，直接输入
            </button>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <p className="label">题量</p>
            <p className="value">120</p>
            <p className="hint">Johnson 版 IPIP · 双向计分</p>
          </div>
          <div className="stat">
            <p className="label">耗时</p>
            <p className="value">≈10 分钟</p>
            <p className="hint">8 题/屏，随时暂停</p>
          </div>
          <div className="stat">
            <p className="label">输出</p>
            <p className="value">人格报告 & 学习策略</p>
            <p className="hint">大五维度 × 学习风格适配</p>
          </div>
        </div>
      </section>

      <section className="card panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">流程概览</p>
            <h2>测试 → 评分 → 策略输出</h2>
          </div>
        </div>
        <div className="question-list">
          <div className="question-card">
            <p className="question-text">1) 人格测验</p>
            <p className="hint">使用官方 120 题，正反向计分，保持测评严谨性。</p>
          </div>
          <div className="question-card">
            <p className="question-text">2) 维度评分</p>
            <p className="hint">即刻计算大五得分与子维度结果，保留高/低/中定位。</p>
          </div>
          <div className="question-card">
            <p className="question-text">3) 学习策略生成</p>
            <p className="hint">基于人格风格匹配学习节奏、协作模式、复盘仪式。</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
