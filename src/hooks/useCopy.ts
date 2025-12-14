import { useAssessment } from '../context/AssessmentContext';
import { copy, type CopyBundle } from '../i18n/copy';

export function useCopy(): CopyBundle {
  const { uiLanguage } = useAssessment();
  return (copy as Record<string, CopyBundle>)[uiLanguage] || copy.en;
}
