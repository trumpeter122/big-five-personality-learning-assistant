import { processAnswers } from '../../docs/packages/score/src/index.ts';
import { mapScoresToResults } from '../assessment';

export const domainParamMap = {
  openness: 'O',
  conscientiousness: 'C',
  extraversion: 'E',
  agreeableness: 'A',
  neuroticism: 'N'
};

const reverseDomainParamMap = Object.fromEntries(
  Object.entries(domainParamMap).map(([key, value]) => [value, key])
);

export const buildReportFromScores = (scoreMap) => {
  const entries = Object.entries(scoreMap)
    .filter(([, val]) => !Number.isNaN(Number(val)))
    .map(([domain, score]) => ({ domain, score: Number(score) }));
  if (!entries.length) return null;
  const scores = processAnswers(entries);
  const generated = mapScoresToResults(scores);
  return { scores, generated };
};

export const parseQueryScores = (search) => {
  const params = new URLSearchParams(search || '');
  const result = {};
  let hasAny = false;
  Object.entries(domainParamMap).forEach(([param, domain]) => {
    const raw = params.get(param);
    if (raw == null) return;
    const num = Number(raw);
    if (Number.isNaN(num)) return;
    result[domain] = num;
    hasAny = true;
  });
  return hasAny ? result : null;
};

export const buildShareSearch = (report) => {
  const params = new URLSearchParams();
  Object.entries(report.scores || {}).forEach(([domain, data]) => {
    const param = reverseDomainParamMap[domain];
    if (!param || !data) return;
    const avg = data.count ? data.score / data.count : data.score;
    params.set(param, (avg || 0).toFixed(2));
  });
  return params.toString();
};
