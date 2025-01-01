import { useState, useMemo, useCallback } from 'react';
import { translations, type Locale, type Translations } from './translations';

const STORAGE_KEY = 'gif-editor-locale';
const SUPPORTED_LOCALES: Locale[] = ['en', 'ko', 'ja', 'zh', 'es', 'pt', 'id', 'ar', 'fr', 'de'];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ko: '한국어',
  ja: '日本語',
  zh: '中文',
  es: 'Español',
  pt: 'Português',
  id: 'Bahasa Indonesia',
  ar: 'العربية',
  fr: 'Français',
  de: 'Deutsch',
};

function detectLocale(): Locale {
  const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (saved && SUPPORTED_LOCALES.includes(saved)) return saved;
  const lang = navigator.language?.toLowerCase() ?? '';
  for (const loc of SUPPORTED_LOCALES) {
    if (lang === loc || lang.startsWith(loc + '-')) return loc;
  }
  return 'en';
}

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);
  const t = useMemo(() => translations[locale] as Translations, [locale]);

  const setLocale = useCallback((loc: Locale) => {
    localStorage.setItem(STORAGE_KEY, loc);
    setLocaleState(loc);
  }, []);

  return { locale, t, setLocale, locales: SUPPORTED_LOCALES };
}
