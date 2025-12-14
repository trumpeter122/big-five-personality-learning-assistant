import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction
} from 'react';
import { useLocation } from 'react-router-dom';
import { processAnswers } from '../../docs/packages/score/src/index.ts';
import {
  buildQuestions,
  mapScoresToResults,
  questionLanguages,
  languageOptions,
  type TestMode
} from '../assessment';
import { buildReportFromScores, buildShareSearch, parseQueryScores } from '../utils/reportShare';
import type { QuestionItem, TraitKey, Report, Scores } from '../types';

type AnswerMap = Record<string, { domain: TraitKey; facet?: number; score: number }>;

interface AssessmentContextValue {
  theme: string;
  setTheme: Dispatch<SetStateAction<string>>;
  uiLanguage: string;
  setUiLanguage: Dispatch<SetStateAction<string>>;
  language: string;
  setLanguage: Dispatch<SetStateAction<string>>;
  questions: QuestionItem[];
  currentQuestions: QuestionItem[];
  totalPages: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  answers: AnswerMap;
  selectAnswer: (_question: QuestionItem, _choice: { score: number }) => void;
  manualScores: Record<TraitKey, number>;
  setManualScores: Dispatch<SetStateAction<Record<TraitKey, number>>>;
  submitTest: () => boolean;
  submitManual: () => boolean;
  report: Report | null;
  setReport: Dispatch<SetStateAction<Report | null>>;
  resetAll: () => void;
  answeredCount: number;
  progress: number;
  testMode: TestMode;
  setTestMode: Dispatch<SetStateAction<TestMode>>;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

export function useAssessment(): AssessmentContextValue {
  const ctx = useContext(AssessmentContext);
  if (!ctx) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return ctx;
}

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<string>('light');
  const [uiLanguage, setUiLanguage] = useState<string>('zh');
  const defaultQuestionLanguage = questionLanguages.includes('zh-cn')
    ? 'zh-cn'
    : questionLanguages[0] || 'en';
  const [language, setLanguage] = useState<string>(defaultQuestionLanguage);
  const [lastAutoLang, setLastAutoLang] = useState<string>(defaultQuestionLanguage);
  const [testMode, setTestMode] = useState<TestMode>('full');
  const [page, setPage] = useState<number>(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [manualScores, setManualScores] = useState<Record<TraitKey, number>>({
    O: 3,
    C: 3,
    E: 3,
    A: 3,
    N: 3
  });
  const location = useLocation();
  const initialReport = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const parsed = parseQueryScores(window.location.search);
    return parsed ? buildReportFromScores(parsed) : null;
  }, []);
  const [report, setReport] = useState<Report | null>(initialReport);

  const questions = useMemo<QuestionItem[]>(() => buildQuestions(language, testMode), [language, testMode]);
  const totalPages = Math.ceil(questions.length / 8);
  const answeredCount = Object.keys(answers).length;
  const progress = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const findQuestionLangForUi = (uiCode: string | null | undefined) => {
    if (!uiCode) return null;
    if (questionLanguages.includes(uiCode)) return uiCode;
    const found = languageOptions.find((lang) => lang.code.toLowerCase().startsWith(uiCode.toLowerCase()));
    return found?.code || null;
  };

  useEffect(() => {
    const target = findQuestionLangForUi(uiLanguage);
    if (target) {
      if (language === lastAutoLang) {
        setLanguage(target);
      }
      setLastAutoLang(target);
    }
  }, [uiLanguage, language, lastAutoLang]);

  useEffect(() => {
    const parsed = parseQueryScores(location.search);
    if (!parsed) return;
    const next = buildReportFromScores(parsed);
    if (!next) return;
    setReport((prev) => {
      if (!prev) return next;
      const prevSearch = buildShareSearch(prev);
      const nextSearch = buildShareSearch(next);
      return prevSearch === nextSearch ? prev : next;
    });
  }, [location.search]);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(questions.length / 8) - 1);
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [language, page, questions.length]);

  const resetAll = () => {
    setAnswers({});
    setReport(null);
    setPage(0);
    setManualScores({ O: 3, C: 3, E: 3, A: 3, N: 3 });
  };

  useEffect(() => {
    setAnswers({});
    setReport(null);
    setPage(0);
  }, [testMode]);

  const selectAnswer = (question: QuestionItem, choice: { score: number }) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: { domain: question.domain, facet: question.facet, score: choice.score }
    }));
  };

  const submitTest = () => {
    if (answeredCount !== questions.length) return false;
    const formatted = Object.entries(answers).map(([, value]) => value);
    const scores = processAnswers(formatted) as Scores;
    const generated = mapScoresToResults(scores);
    setReport({ scores, generated });
    return true;
  };

  const submitManual = () => {
    const manual = Object.entries(manualScores).map(([domain, score]) => ({
      domain,
      score: Number(score)
    }));
    const scores = processAnswers(manual) as Scores;
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
    uiLanguage,
    setUiLanguage,
    language,
    setLanguage,
    testMode,
    setTestMode,
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
    progress,
    setReport
  };

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>;
}
