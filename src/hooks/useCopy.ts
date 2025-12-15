import { useAssessment } from '../context/AssessmentContext';
import { copy, type CopyBundle } from '../i18n/copy';

type CopyKey = keyof typeof copy;

const resolveCopyKey = (uiLanguage?: string): CopyKey => {
  if (!uiLanguage) return 'en';
  const code = uiLanguage.toLowerCase();
  if ((copy as Record<string, CopyBundle>)[code]) return code as CopyKey;
  if (code.startsWith('zh-hk') || code.startsWith('zh-tw') || code.startsWith('zh-hant')) return 'zh-hk';
  if (code.startsWith('zh')) return 'zh';
  if (code.startsWith('en')) return 'en';
  return 'en';
};

export function useCopy(): CopyBundle {
  const { uiLanguage } = useAssessment();
  const key = resolveCopyKey(uiLanguage);
  return (copy as Record<string, CopyBundle>)[key] || copy.en;
}
