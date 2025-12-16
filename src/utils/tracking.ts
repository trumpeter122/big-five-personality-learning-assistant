import type { Level, TraitKey } from '../types';

export type DrawLogEntry = {
  id: string;
  trait: TraitKey;
  level: Level;
  text: string;
  drawnAt: number;
  completedAt?: number;
};

export type StreakState = {
  current: number;
  longest: number;
  lastCompletionDate?: string;
};

export type TrackingState = {
  entries: DrawLogEntry[];
  streak: StreakState;
};

const STORAGE_KEY = 'gacha-tracking-v1';
const MAX_ENTRIES = 200;

export const emptyTracking: TrackingState = {
  entries: [],
  streak: { current: 0, longest: 0 }
};

const pad = (value: number) => value.toString().padStart(2, '0');

const toDateKey = (ms: number) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const fromDateKey = (key: string) => {
  const safeKey = key?.trim();
  if (!safeKey) return null;
  const parsed = Date.parse(`${safeKey}T12:00:00`);
  return Number.isNaN(parsed) ? null : parsed;
};

const diffDays = (a: string, b: string) => {
  const aDate = new Date(`${a}T00:00:00`);
  const bDate = new Date(`${b}T00:00:00`);
  const diff = aDate.getTime() - bDate.getTime();
  return Math.round(diff / 86400000);
};

const recomputeStreak = (entries: DrawLogEntry[]): StreakState => {
  const completed = entries
    .filter((e) => e.completedAt)
    .sort((a, b) => (a.completedAt || 0) - (b.completedAt || 0));

  if (!completed.length) {
    return { current: 0, longest: 0 };
  }

  let prevDate: string | null = null;
  let currentStreak = 0;
  let longest = 0;
  let lastDate = '';

  completed.forEach((entry) => {
    const dateKey = toDateKey(entry.completedAt as number);
    if (dateKey === lastDate) return; // skip duplicate same-day completions
    lastDate = dateKey;

    if (!prevDate) {
      currentStreak = 1;
    } else {
      const diff = diffDays(dateKey, prevDate);
      currentStreak = diff === 1 ? currentStreak + 1 : 1;
    }
    longest = Math.max(longest, currentStreak);
    prevDate = dateKey;
  });

  const todayKey = toDateKey(Date.now());
  const gap = diffDays(todayKey, lastDate);
  const current = gap === 0 || gap === 1 ? currentStreak : 0;

  return { current, longest, lastCompletionDate: lastDate };
};

export const loadTracking = (): TrackingState => {
  if (typeof window === 'undefined') return emptyTracking;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyTracking;
    const parsed = JSON.parse(raw) as TrackingState;
    if (!parsed.entries || !Array.isArray(parsed.entries)) return emptyTracking;
    const entries = parsed.entries.slice(0, MAX_ENTRIES);
    return {
      entries,
      streak: recomputeStreak(entries)
    };
  } catch {
    return emptyTracking;
  }
};

export const saveTracking = (state: TrackingState) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Unable to persist tracking state', err);
  }
};

export const recordDraw = (state: TrackingState, entry: Omit<DrawLogEntry, 'drawnAt'> & { drawnAt?: number }) => {
  const drawnAt = entry.drawnAt || Date.now();
  const nextEntries = [{ ...entry, drawnAt }, ...state.entries].slice(0, MAX_ENTRIES);
  return {
    entries: nextEntries,
    streak: recomputeStreak(nextEntries)
  };
};

export const setEntryCompletion = (state: TrackingState, entryId: string, completed: boolean) => {
  const nextEntries = state.entries.map((entry) =>
    entry.id === entryId
      ? {
          ...entry,
          completedAt: completed ? entry.completedAt || Date.now() : undefined
        }
      : entry
  );
  return {
    entries: nextEntries,
    streak: recomputeStreak(nextEntries)
  };
};

export const resetTracking = (): TrackingState => emptyTracking;

export const buildCsv = (entries: DrawLogEntry[]) => {
  const header = 'Drawn At,Completed At,Trait,Level,Text';
  const escape = (value: string | number) => `"${String(value ?? '').replace(/"/g, '""')}"`;

  const rows = entries.map((entry) =>
    [
      toDateKey(entry.drawnAt),
      entry.completedAt ? toDateKey(entry.completedAt) : '',
      entry.trait,
      entry.level,
      entry.text
    ]
      .map(escape)
      .join(',')
  );

  return [header, ...rows].join('\n');
};

const parseCsvLine = (line: string) => {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
      continue;
    }
    current += char;
  }
  values.push(current);
  return values.map((v) => v.trim());
};

export const importTrackingFromCsv = (csv: string): TrackingState => {
  if (!csv) return emptyTracking;
  const lines = csv.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length <= 1) return emptyTracking;

  const entries: DrawLogEntry[] = [];
  const [, ...rows] = lines;
  rows.forEach((row, idx) => {
    const cells = parseCsvLine(row);
    if (cells.length < 5) return;
    const [drawnAtStr, completedAtStr, trait, level, text] = cells;
    if (!['O', 'C', 'E', 'A', 'N'].includes(trait)) return;
    if (!['high', 'neutral', 'low'].includes(level)) return;

    const drawnAt = fromDateKey(drawnAtStr);
    if (!drawnAt) return;
    const completedAt = completedAtStr ? fromDateKey(completedAtStr) || undefined : undefined;
    entries.push({
      id: `import-${idx}-${drawnAt}`,
      trait: trait as TraitKey,
      level: level as Level,
      text: text || '',
      drawnAt,
      completedAt
    });
  });

  const sorted = entries.sort((a, b) => b.drawnAt - a.drawnAt).slice(0, MAX_ENTRIES);
  return {
    entries: sorted,
    streak: recomputeStreak(sorted)
  };
};
