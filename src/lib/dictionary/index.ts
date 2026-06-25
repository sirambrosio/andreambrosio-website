import type { Locale } from '@/lib/i18n';
import { DEFAULT_LOCALE } from '@/lib/i18n';
import { pt, type Dict } from './pt';
import { en } from './en';
import { es } from './es';
import { zh } from './zh';
import { fr } from './fr';
import { de } from './de';
import { ja } from './ja';
import { ru } from './ru';

export type { Dict } from './pt';

const DICTS: Record<Locale, Dict> = { pt, en, es, zh, fr, de, ja, ru };

/** Retorna o dicionário completo do locale (SSR-friendly, sem client context). */
export function getDict(locale: Locale): Dict {
  return DICTS[locale] ?? DICTS[DEFAULT_LOCALE];
}
