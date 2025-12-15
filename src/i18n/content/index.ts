import en from './en';
import zh from './zh';
import zhHk from './zh-hk';
import type { LocaleBundle } from '../../types';

const locales: Record<string, LocaleBundle> = {
  en,
  zh,
  'zh-hk': zhHk
};

const findLocale = (uiLanguage) => {
  if (!uiLanguage) return 'en';
  const code = uiLanguage.toLowerCase();
  if (locales[code]) return code;
  if (code.startsWith('zh-hk') || code.startsWith('zh-tw') || code.startsWith('zh-hant')) return 'zh-hk';
  if (code.startsWith('en')) return 'en';
  if (code.startsWith('zh')) return 'zh';
  return 'en';
};

export function getLocaleContent(uiLanguage?: string): LocaleBundle {
  const key = findLocale(uiLanguage);
  return locales[key] || locales.en;
}
