import { en } from './locales/en';
import { ko } from './locales/ko';
import { ja } from './locales/ja';
import { zh } from './locales/zh';
import { es } from './locales/es';
import { pt } from './locales/pt';
import { id } from './locales/id';
import { ar } from './locales/ar';
import { fr } from './locales/fr';
import { de } from './locales/de';

export const translations = {
  en,
  ko,
  ja,
  zh,
  es,
  pt,
  id,
  ar,
  fr,
  de,
} as const;

export type Locale = keyof typeof translations;
export type Translations = { [K in keyof typeof translations.en]: string };
