import * as en from './en';
import * as zh from './zh';

const locales = {
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

export function getLocaleContent(uiLanguage) {
  const key = findLocale(uiLanguage);
  return locales[key] || locales.en;
}
