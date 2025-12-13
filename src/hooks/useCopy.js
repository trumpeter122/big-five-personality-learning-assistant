import { useAssessment } from '../context/AssessmentContext';
import { copy } from '../i18n/copy';

export function useCopy() {
  const { uiLanguage } = useAssessment();
  return copy[uiLanguage] || copy.en;
}
