import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { processAnswers } from '../../docs/packages/score/src/index.ts';
import { buildQuestions, mapScoresToResults } from '../assessment';

const AssessmentContext = createContext(null);

export function useAssessment() {
  return useContext(AssessmentContext);
}

export function AssessmentProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('zh-cn');
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [manualScores, setManualScores] = useState({ O: 3, C: 3, E: 3, A: 3, N: 3 });
  const [report, setReport] = useState(null);

  const questions = useMemo(() => buildQuestions(language), [language]);
  const totalPages = Math.ceil(questions.length / 8);
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    setAnswers({});
    setReport(null);
    setPage(0);
  }, [language]);

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
    const start = page * 8;
    const end = start + 8;
    return questions.slice(start, end);
  }, [page, questions]);

  const value = {
    theme,
    setTheme,
    language,
    setLanguage,
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
