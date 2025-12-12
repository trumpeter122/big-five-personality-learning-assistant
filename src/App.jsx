import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { processAnswers } from '../docs/packages/score/src/index.ts';
import Home from './pages/Home';
import TestPage from './pages/Test';
import ManualPage from './pages/Manual';
import ResultsPage from './pages/Results';
import { buildQuestions, mapScoresToResults } from './assessment';
import './App.css';

const QUESTIONS_PER_PAGE = 8;
const AssessmentContext = createContext(null);

export const useAssessment = () => useContext(AssessmentContext);

function AssessmentProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [language] = useState('zh-cn');
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [manualScores, setManualScores] = useState({ O: 3, C: 3, E: 3, A: 3, N: 3 });
  const [report, setReport] = useState(null);

  const questions = useMemo(() => buildQuestions(language), [language]);
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const resetAll = () => {
    setAnswers({});
    setReport(null);
    setPage(0);
    setManualScores({ O: 3, C: 3, E: 3, A: 3, N: 3 });
  };

  const selectAnswer = (question, choice) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: { domain: question.domain, facet: question.facet, score: choice.score }
    }));
  };

  const submitTest = () => {
    if (answeredCount !== questions.length) return false;
    const formatted = Object.entries(answers).map(([, value]) => value);
    const scores = processAnswers(formatted);
    const generated = mapScoresToResults(scores);
    setReport({ scores, generated });
    return true;
  };

  const submitManual = () => {
    const manual = Object.entries(manualScores).map(([domain, score]) => ({
      domain,
      score: Number(score)
    }));
    const scores = processAnswers(manual);
    const generated = mapScoresToResults(scores);
    setReport({ scores, generated });
    return true;
  };

  const currentQuestions = useMemo(() => {
    const start = page * QUESTIONS_PER_PAGE;
    const end = start + QUESTIONS_PER_PAGE;
    return questions.slice(start, end);
  }, [page, questions]);

  const value = {
    theme,
    setTheme,
    language,
    questions,
    currentQuestions,
    totalPages,
    page,
    setPage,
    answers,
    selectAnswer,
    manualScores,
    setManualScores,
    submitTest,
    submitManual,
    report,
    resetAll,
    answeredCount,
    progress
  };

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>;
}

function Header() {
  const { theme, setTheme } = useAssessment();

  return (
    <header className="app-header">
      <div className="header-left">
        <p className="eyebrow">人格学习助手</p>
        <div className="brand-row">
          <h1>「人格适配」学习策略引擎</h1>
          <div className="pill accent">蓝白 · Mediterranean</div>
        </div>
        <p className="subtitle">
          基于 Big Five（120 题）与学习风格适配理论，生成与你气质吻合的学习路线与复习仪式。
        </p>
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            主页
          </NavLink>
          <NavLink to="/test" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            严谨测试
          </NavLink>
          <NavLink
            to="/manual"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            直接输入
          </NavLink>
          <NavLink
            to="/results"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            策略结果
          </NavLink>
        </nav>
      </div>
      <div className="header-actions">
        <button className="ghost" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? '切换暗色' : '切换亮色'}
        </button>
      </div>
    </header>
  );
}

function App() {
  return (
    <AssessmentProvider>
      <div className="app-shell">
        <Header />
        <div className="page-stack">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/manual" element={<ManualPage />} />
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </div>
      </div>
    </AssessmentProvider>
  );
}

export default App;
