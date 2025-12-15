import templateEn from '../docs/packages/results/src/data/en';
import languages from '../docs/packages/questions/src/data/languages';
import { getLocaleContent } from './i18n/content';
import type {
  TraitKey,
  Level,
  QuestionItem,
  Playbook,
  TraitLabels,
  DomainResult,
  Scores,
  LocaleBundle
} from './types';

const questionModules = import.meta.glob('../docs/packages/questions/src/data/*/questions.ts', { eager: true });
const choiceModules = import.meta.glob('../docs/packages/questions/src/data/*/choices.ts', { eager: true });

const questionBank: Record<string, QuestionItem[]> = Object.entries(questionModules).reduce(
  (acc, [path, mod]) => {
    const code = path.split('/data/')[1].split('/')[0];
    acc[code] = (mod as { default: QuestionItem[] }).default;
    return acc;
  },
  {} as Record<string, QuestionItem[]>
);

const choiceBank: Record<string, Record<string, { text: string; score: number }[]>> = Object.entries(choiceModules).reduce(
  (acc, [path, mod]) => {
    const code = path.split('/data/')[1].split('/')[0];
    acc[code] = (mod as { default: Record<string, { text: string; score: number }[]> }).default;
    return acc;
  },
  {} as Record<string, Record<string, { text: string; score: number }[]>>
);

const learningPlaybookEn: Playbook = {
  O: {
    high: [
      'Weave cross-disciplinary examples or analogies to keep material fresh; capture quick ideas in spare minutes and validate fast.',
      'Turn outputs into a portfolio or mini experiments—showing your work fuels motivation.'
    ],
    neutral: [
      'Reserve one hour weekly for exploratory reading; use templates for the rest to stay curious without drifting.',
      'Map new knowledge onto existing frameworks so creativity and solid understanding move together.'
    ],
    low: [
      'Lean on structured materials with key worked examples to reduce overload and anxiety.',
      'Start with “replicate then tweak”: master a template before making small innovations.'
    ]
  },
  C: {
    high: [
      'Break work into pomodoros and milestones; close the day with a retro to quantify progress and quality.',
      'Pre-flight complex tasks with a mock run to lighten the cognitive load on execution day.'
    ],
    neutral: [
      'Plan with a 3-item todo and timeboxes; keep a 20% buffer to avoid frustration.',
      'Define starter actions (open outline, write the title) to lower the friction of beginning.'
    ],
    low: [
      'Work in 15–20 minute micro-sprints and reward yourself immediately to build a positive loop.',
      'Use a buddy or coach for weekly check-ins to add external accountability.'
    ]
  },
  E: {
    high: [
      'Favor discussion-based or group learning; teaching others cements your own learning. Host a weekly mini-share.',
      'Use commutes or workouts for podcasts and voice notes, channeling social energy into input.'
    ],
    neutral: [
      'Pair solo deep work with short group discussions at a 2:1 ratio to keep rhythm without social drain.',
      'Record a 3-minute voice question for peers to get quick feedback.'
    ],
    low: [
      'Prioritize async learning: writing, detailed notes, or screen-recorded explainers to skip live pressure.',
      'Book quiet blocks away from messaging to keep a controlled pace.'
    ]
  },
  A: {
    high: [
      'Use a “peer TA” mode—answer questions or swap reviews; social reciprocity boosts retention.',
      'Take coordination or integration roles in team work to leverage your empathy for collaboration.'
    ],
    neutral: [
      'Create a mini checklist for feedback (expectations, deadline, format) to balance warmth with clarity.',
      'Alternate solo work with paired retros so you keep efficiency and still get support.'
    ],
    low: [
      'Set discussion rules and timeboxes to prevent runaway debates; support points with facts and examples.',
      'Pick tasks with clear, measurable goals to reduce interpersonal friction on focus.'
    ]
  },
  N: {
    high: [
      'Ship a minimal viable version first, then iterate to curb perfectionism-driven delays.',
      'Add an emotional buffer: 5 minutes of breathing or stretching before study; short walks between tasks.'
    ],
    neutral: [
      'Keep a steady pace and sleep schedule; log mood and performance to spot triggers early.',
      'When stuck, write three actionable steps to prevent emotional escalation.'
    ],
    low: [
      'Use your stable affect to take high-pressure or tight-deadline tasks as the team’s ballast.',
      'Add deliberate challenges (timed quizzes) so comfort doesn’t slide into drift.'
    ]
  }
};

export const traitTones: Record<
  TraitKey,
  { accent: string; accent2: string; pill: string }
> = {
  O: {
    accent: '#bc5090',
    accent2: '#ff6361',
    pill: 'rgba(188, 80, 144, 0.16)',
  },
  C: {
    accent: '#003f5c',
    accent2: '#58508d',
    pill: 'rgba(0, 63, 92, 0.16)',
  },
  E: {
    accent: '#ffa600',
    accent2: '#003f5c',
    pill: 'rgba(255, 166, 0, 0.16)',
  },
  A: {
    accent: '#ff6361',
    accent2: '#ffa600',
    pill: 'rgba(255, 99, 97, 0.16)',
  },
  N: {
    accent: '#58508d',
    accent2: '#bc5090',
    pill: 'rgba(88, 80, 141, 0.16)',
  },
};

export const languageOptions = languages;
export const questionLanguages = Object.keys(questionBank);

const fallbackLevelText: Record<Level, string> =
  getLocaleContent('en').levelText || {
    high: 'High',
    neutral: 'Mid',
    low: 'Low'
  };

export function getLevelText(uiLanguage?: string): Record<Level, string> {
  const bundle = getLocaleContent(uiLanguage);
  const localized = bundle.levelText || {};

  return {
    high: localized.high || fallbackLevelText.high,
    neutral: localized.neutral || fallbackLevelText.neutral,
    low: localized.low || fallbackLevelText.low
  };
}

export type TestMode = 'full' | 'short';

const SHORT_QUESTION_COUNT = 20;

export function buildQuestions(language: string, mode: TestMode = 'full'): QuestionItem[] {
  const questions = questionBank[language] || questionBank['en'];
  const choices = choiceBank[language] || choiceBank['en'];
  const list = mode === 'short' ? questions.slice(0, SHORT_QUESTION_COUNT) : questions;

  return list.map((question, index) => ({
    ...question,
    num: index + 1,
    choices: choices[question.keyed]
  }));
}

export function mapScoresToResults(scores: Scores): DomainResult[] {
  return Object.keys(scores)
    .map((key) => {
      const domainTemplate = templateEn.find((template) => template.domain === key);
      if (!domainTemplate) return null;

      const { result, count, score } = scores[key as TraitKey];
      const resultText = domainTemplate.results.find((item) => item.score === result)?.text;

      const facets = domainTemplate.facets
        .map((facet) => {
          const facetScore = scores[key as TraitKey].facet?.[facet.facet];
          if (!facetScore) return null;
          return {
            facet: facet.facet,
            title: facet.title,
            text: facet.text,
            score: facetScore.score,
            count: facetScore.count,
            scoreText: facetScore.result
          };
        })
        .filter(Boolean);

      return {
        domain: domainTemplate.domain as TraitKey,
        title: domainTemplate.title,
        shortDescription: domainTemplate.shortDescription,
        description: domainTemplate.description,
        scoreText: resultText,
        count,
        score,
        facets
      } satisfies DomainResult;
    })
    .filter(Boolean) as DomainResult[];
}

export const getLocaleBundle = (uiLanguage?: string): LocaleBundle => getLocaleContent(uiLanguage);

export function getTraitLabels(uiLanguage?: string): TraitLabels {
  const bundle = getLocaleContent(uiLanguage);
  return (bundle.labels as TraitLabels) || ({} as TraitLabels);
}

export function getTraitNames(domain: TraitKey, uiLanguage?: string) {
  const bundle = getLocaleContent(uiLanguage);
  const labels = (bundle.labels?.[domain] as { name?: string; alt?: string }) || { name: domain };
  return {
    main: labels.name || domain,
    alt: labels.alt || labels.name || domain
  };
}

export function getLearningPlaybook(uiLanguage?: string): Playbook {
  const bundle = getLocaleContent(uiLanguage);
  return (bundle.playbook as Playbook) || learningPlaybookEn;
}

export function getResultText(domain: TraitKey, level: Level, uiLanguage?: string, fallback?: string) {
  const bundle = getLocaleContent(uiLanguage);
  return bundle.resultText?.[domain]?.[level] || fallback || '';
}
