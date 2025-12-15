import { getLearningPlaybook, getLevelText, getTraitNames, getResultText } from '../assessment';
import { buildShareSearch } from './reportShare';
import type { Report, Playbook, Level } from '../types';
import type { CopyBundle } from '../i18n/copy';

const styles = `
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 20px; font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif; background: #f5f7fb; color: #0f172a; }
  .report { max-width: 900px; margin: 0 auto; display: grid; gap: 12px; }
  .hero { background: #fff; border: 1px solid #e5e7eb; padding: 16px; display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
  h1 { margin: 0; font-size: 22px; letter-spacing: 0.01em; }
  h2 { margin: 4px 0 0; color: #4b5563; font-size: 14px; font-weight: 600; }
  .meta { color: #6b7280; font-size: 13px; margin: 4px 0 0; }
  .badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; background: #e8f1fb; color: #1e4b85; border: 1px solid #d1e4ff; font-weight: 700; letter-spacing: 0.02em; text-transform: uppercase; }
  table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #e5e7eb; }
  th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
  th { background: #f0f4f8; color: #0f172a; }
  .trait { background: #fff; border: 1px solid #e5e7eb; padding: 14px; page-break-inside: avoid; }
  .trait-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
  .trait-title { margin: 0; font-size: 16px; letter-spacing: 0.01em; }
  .chip { display: inline-flex; align-items: center; padding: 5px 9px; background: #f3f4f6; color: #111827; font-weight: 700; border: 1px solid #e5e7eb; }
  .level.high { background: #e0f2fe; color: #075985; }
  .level.neutral { background: #f3f4f6; color: #111827; }
  .level.low { background: #fef2f2; color: #b91c1c; }
  .lead { margin: 8px 0 10px; color: #334155; line-height: 1.5; }
  .facets { display: flex; flex-wrap: wrap; gap: 6px; margin: 6px 0 4px; }
  .facet { padding: 6px 8px; background: #f9fafb; border: 1px solid #e5e7eb; font-size: 12px; color: #374151; }
  .strategies ul { margin: 8px 0 0; padding-left: 18px; color: #374151; line-height: 1.5; }
  .link-card { background: #fff; border: 1px solid #e5e7eb; padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
  .share-link { color: #1d4ed8; font-weight: 700; text-decoration: none; }
  .share-link:hover { text-decoration: underline; }
  footer { margin-top: 8px; text-align: right; color: #6b7280; font-size: 12px; }
  @media print { body { background: #fff; } .report { margin: 0; } }
`;

function buildSummaryRows(report: Report, levelLabels: Record<Level, string>, uiLanguage: string) {
  return report.generated
    .map((item) => {
      const score = report.scores[item.domain];
      const level = (score?.result || 'neutral') as Level;
      const rawScore = score?.score != null ? score.score.toFixed(0) : '-';
      const avg = score?.count ? (score.score / score.count).toFixed(2) : '-';
      const names = getTraitNames(item.domain, uiLanguage);
      const label = names.main;
      return `
        <tr>
          <td><span class="badge">${item.domain}</span> ${label}</td>
          <td>${rawScore}</td>
          <td>${avg}</td>
          <td><span class="chip level ${level}">${levelLabels[level] || level}</span></td>
        </tr>
      `;
    })
    .join('');
}

function buildTraitSections(
  report: Report,
  copy: CopyBundle,
  levelLabels: Record<Level, string>,
  playbook: Playbook,
  uiLanguage: string
) {
  return report.generated
    .map((item) => {
      const score = report.scores[item.domain];
      const level = (score?.result || 'neutral') as Level;
      const levelLabel = levelLabels[level] || level;
      const strategies = playbook[item.domain]?.[level] || [];
      const names = getTraitNames(item.domain, uiLanguage);
      const description = getResultText(item.domain, level, uiLanguage, item.scoreText || '');
      const facets =
        item.facets?.map(
          (facet) =>
            `<span class="facet">${facet.title}: ${facet.scoreText || facet.result || ''}</span>`
        ) || [];
      const hasAlt = names.alt && names.alt !== names.main;

      return `
        <article class="trait">
          <div class="trait-head">
            <div>
              <h3 class="trait-title">${names.main}</h3>
              ${hasAlt ? `<div class="meta">${names.alt}</div>` : ''}
            </div>
            <span class="chip level ${level}">${levelLabel}</span>
          </div>
          <p class="lead">${description}</p>
          ${
            facets.length
              ? `<div class="meta">${copy.pdfFacets}</div><div class="facets">${facets.join(
                  ''
                )}</div>`
              : ''
          }
          ${
            strategies.length
              ? `<div class="strategies">
                  <div class="meta">${copy.pdfStrategies}</div>
                  <ul>${strategies.map((tip) => `<li>${tip}</li>`).join('')}</ul>
                </div>`
              : ''
          }
        </article>
      `;
    })
    .join('');
}

export function exportReportPdf(
  report: Report,
  copy: CopyBundle,
  uiLanguage: string,
  playbook?: Playbook
) {
  if (typeof window === 'undefined') return false;
  if (!report?.generated?.length) return false;

  const levelLabels = getLevelText(uiLanguage);
  const learning = playbook || getLearningPlaybook(uiLanguage);
  const timestamp = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date());
  const shareSearch = buildShareSearch(report);
  const basePath = (import.meta.env.BASE_URL || '').replace(/\/+$/, '');
  const shareUrl = `${window.location.origin}${basePath}/results${shareSearch ? `?${shareSearch}` : ''}`;

  const summaryRows = buildSummaryRows(report, levelLabels, uiLanguage);
  const traits = buildTraitSections(report, copy, levelLabels, learning, uiLanguage);

  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${copy.pdfTitle}</title>
        <style>${styles}</style>
      </head>
      <body>
        <div class="report">
          <div class="hero">
            <div>
              <h1>${copy.pdfTitle}</h1>
              <h2>${copy.pdfSubtitle}</h2>
              <p class="meta">${copy.pdfGeneratedAt}: ${timestamp}</p>
            </div>
            <div class="badge">${copy.badge}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>${copy.pdfTraitSummary}</th>
                <th>${copy.pdfRawScore}</th>
                <th>${copy.pdfAvgScore}</th>
                <th>${copy.pdfLevel}</th>
              </tr>
            </thead>
            <tbody>
              ${summaryRows}
            </tbody>
          </table>
          <div class="link-card">
            <div>
              <p class="meta">${copy.pdfSharePrompt}</p>
              <a class="share-link" href="${shareUrl}" target="_blank" rel="noopener">
                ${copy.pdfShareLink}
              </a>
            </div>
          </div>
          ${traits}
          <footer>${copy.badge} · ${timestamp}</footer>
        </div>
      </body>
    </html>
  `;

  const win = window.open('', '_blank', 'width=980,height=760');
  if (!win) {
    return false;
  }

  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
    win.close();
  }, 300);

  return true;
}
