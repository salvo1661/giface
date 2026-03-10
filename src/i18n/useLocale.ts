import { useState, useMemo, useCallback, useEffect } from 'react';
import { translations, type Locale, type Translations } from './translations';

const STORAGE_KEY = 'gif-editor-locale';
export const DEFAULT_LOCALE: Locale = 'en';
export const SUPPORTED_LOCALES: Locale[] = ['en', 'ko', 'ja', 'zh', 'es', 'pt', 'id', 'ar', 'fr', 'de'];

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

export function isSupportedLocale(value?: string): value is Locale {
  return !!value && SUPPORTED_LOCALES.includes(value as Locale);
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const [first] = normalized.split('/').filter(Boolean);
  return isSupportedLocale(first) ? (first as Locale) : null;
}

export function stripLocaleFromPathname(pathname: string): string {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const parts = normalized.split('/').filter(Boolean);
  if (parts.length === 0) return '/';
  const [first, ...rest] = parts;
  if (isSupportedLocale(first)) {
    return rest.length ? `/${rest.join('/')}` : '/';
  }
  return normalized;
}

export function buildLocalePath(locale: Locale, pathname: string): string {
  const basePath = stripLocaleFromPathname(pathname);
  if (locale === DEFAULT_LOCALE) return basePath;
  return basePath === '/' ? `/${locale}` : `/${locale}${basePath}`;
}

function detectLocale(): Locale {
  if (typeof window !== 'undefined') {
    const pathLocale = getLocaleFromPathname(window.location.pathname);
    if (pathLocale) return pathLocale;
  }
  const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (saved && SUPPORTED_LOCALES.includes(saved)) return saved;
  const lang = navigator.language?.toLowerCase() ?? '';
  for (const loc of SUPPORTED_LOCALES) {
    if (lang === loc || lang.startsWith(loc + '-')) return loc;
  }
  return DEFAULT_LOCALE;
}

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const pathLocale = getLocaleFromPathname(window.location.pathname);
    if (pathLocale && pathLocale !== locale) {
      localStorage.setItem(STORAGE_KEY, pathLocale);
      setLocaleState(pathLocale);
    }
  }, [locale]);

  const t = useMemo(() => translations[locale] as Translations, [locale]);

  const setLocale = useCallback((loc: Locale) => {
    localStorage.setItem(STORAGE_KEY, loc);
    setLocaleState(loc);
  }, []);

  return { locale, t, setLocale, locales: SUPPORTED_LOCALES };
}
