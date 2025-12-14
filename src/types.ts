export type TraitKey = 'O' | 'C' | 'E' | 'A' | 'N';

export type Level = 'high' | 'neutral' | 'low';

export interface TraitLabel {
  name: string;
  alt: string;
  tone?: string;
}

export type TraitLabels = Record<TraitKey, TraitLabel>;

export type Playbook = Record<TraitKey, Partial<Record<Level, string[]>>>;

export type CardsDeck = Record<TraitKey, Partial<Record<Level, string[]>>>;

export interface QuestionChoice {
  text: string;
  score: number;
}

export interface QuestionItem {
  id: string;
  text: string;
  domain: TraitKey;
  facet?: number;
  num: number;
  choices: QuestionChoice[];
}

export interface ScoreFacet {
  score: number;
  count: number;
  result: Level;
}

export interface ScoreDomain {
  score: number;
  count: number;
  result: Level;
  facet?: Record<string | number, ScoreFacet>;
}

export type Scores = Record<TraitKey, ScoreDomain>;

export interface DomainResultFacet {
  facet: number;
  title: string;
  scoreText?: string;
  result?: string;
  count?: number;
  score?: number;
}

export interface DomainResult {
  domain: TraitKey;
  title: string;
  shortDescription?: string;
  description?: string;
  scoreText?: string;
  count?: number;
  score?: number;
  facets?: DomainResultFacet[];
}

export interface Report {
  scores: Scores;
  generated: DomainResult[];
}

export interface LocaleBundle {
  labels?: Partial<Record<TraitKey, TraitLabel>>;
  playbook?: Playbook;
  cards?: CardsDeck;
  resultText?: Partial<Record<TraitKey, Partial<Record<Level, string>>>>;
}
