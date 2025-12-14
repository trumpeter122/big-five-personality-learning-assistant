import en from './en';
import zh from './zh';
import type { LocaleBundle } from '../../types';

const locales: Record<string, LocaleBundle> = {
  en,
  zh
};

const findLocale = (uiLanguage) => {
  if (!uiLanguage) return 'en';
  const code = uiLanguage.toLowerCase();
  if (locales[code]) return code;
  if (code.startsWith('en')) return 'en';
  if (code.startsWith('zh')) return 'zh';
  return 'en';
};

export function getLocaleContent(uiLanguage?: string): LocaleBundle {
  const key = findLocale(uiLanguage);
  return locales[key] || locales.en;
}
