import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { useCopy } from '../hooks/useCopy';

function Home() {
  const { resetAll, setTestMode } = useAssessment();
  const c = useCopy();
  const navigate = useNavigate();

  const goTest = () => {
    setTestMode('full');
    resetAll();
    navigate('/test');
  };

  const goShortTest = () => {
    setTestMode('short');
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
            {c.heroPills.map((pill) => (
              <span key={pill} className="pill soft">
                {pill}
              </span>
            ))}
          </div>
          <p className="hero-text">{c.heroText}</p>
          <div className="cta-row">
            <button className="primary" onClick={goTest}>
              {c.startTest}
            </button>
            <button className="ghost" onClick={goShortTest}>
              {c.startShort}
            </button>
            <button className="ghost" onClick={goManual}>
              {c.startManual}
            </button>
          </div>
          <p className="hint">{c.testAccuracyNote}</p>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <p className="label">{c.statQuestions}</p>
            <p className="value">120</p>
            <p className="hint">{c.statQuestionsHint}</p>
          </div>
          <div className="stat">
            <p className="label">{c.statTime}</p>
            <p className="value">{c.statTimeVal}</p>
            <p className="hint">{c.statTimeHint}</p>
          </div>
          <div className="stat">
            <p className="label">{c.statOutput}</p>
            <p className="value">{c.statOutputHint}</p>
            <p className="hint">{c.statOutputHint}</p>
          </div>
        </div>
      </section>

      <section className="card panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">{c.flowOverview}</p>
            <h2>{c.flowTitle}</h2>
          </div>
        </div>
        <div className="question-list">
          <div className="question-card">
            <p className="question-text">{`1) ${c.flowStepTitles[0]}`}</p>
            <p className="hint">{c.flowSteps[0]}</p>
          </div>
          <div className="question-card">
            <p className="question-text">{`2) ${c.flowStepTitles[1]}`}</p>
            <p className="hint">{c.flowSteps[1]}</p>
          </div>
          <div className="question-card">
            <p className="question-text">{`3) ${c.flowStepTitles[2]}`}</p>
            <p className="hint">{c.flowSteps[2]}</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
