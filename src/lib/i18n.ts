/**
 * i18n · Andre Ambrósio
 * ──────────────────────────────────────────────────────────────────────────
 * 7 idiomas com roteamento por locale (/[locale]/...), SSR + hreflang.
 * Foco SEO/GEO: cada locale é uma URL real e indexável, não troca client-side.
 *
 * Edge-safe: este módulo é importado pelo middleware (edge runtime) e por
 * Server/Client Components — NÃO importar nada de `node:*` aqui.
 */

export const LOCALES = ['pt', 'en', 'es', 'zh', 'fr', 'de', 'ja'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'pt';

export interface LocaleMeta {
  /** Nome no próprio idioma (mostrado no switcher) */
  native: string;
  /** Nome em inglês (referência) */
  name: string;
  flag: string;
  /** valor para hreflang / alternates (BCP-47) */
  hreflang: string;
  /** valor para o atributo <html lang> */
  htmlLang: string;
  /** locale OpenGraph (xx_XX) */
  ogLocale: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  pt: { native: 'Português', name: 'Portuguese', flag: '🇧🇷', hreflang: 'pt-BR',   htmlLang: 'pt-BR',   ogLocale: 'pt_BR' },
  en: { native: 'English',   name: 'English',    flag: '🇺🇸', hreflang: 'en',      htmlLang: 'en',      ogLocale: 'en_US' },
  es: { native: 'Español',   name: 'Spanish',    flag: '🇪🇸', hreflang: 'es',      htmlLang: 'es',      ogLocale: 'es_ES' },
  zh: { native: '简体中文',    name: 'Chinese',    flag: '🇨🇳', hreflang: 'zh-Hans', htmlLang: 'zh-Hans', ogLocale: 'zh_CN' },
  fr: { native: 'Français',  name: 'French',     flag: '🇫🇷', hreflang: 'fr',      htmlLang: 'fr',      ogLocale: 'fr_FR' },
  de: { native: 'Deutsch',   name: 'German',     flag: '🇩🇪', hreflang: 'de',      htmlLang: 'de',      ogLocale: 'de_DE' },
  ja: { native: '日本語',      name: 'Japanese',   flag: '🇯🇵', hreflang: 'ja',      htmlLang: 'ja',      ogLocale: 'ja_JP' },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

/** Garante um Locale válido, com fallback no default. */
export function asLocale(value: string | undefined | null): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/**
 * Detecta o melhor locale a partir do header Accept-Language.
 * Mapeia variantes de browser (pt-PT, en-GB, zh-CN, zh-TW...) pros nossos 7.
 */
export function detectLocaleFromHeader(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=');
      return { tag: tag.trim().toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    if (tag.startsWith('pt')) return 'pt';
    if (tag.startsWith('en')) return 'en';
    if (tag.startsWith('es')) return 'es';
    if (tag.startsWith('zh')) return 'zh';
    if (tag.startsWith('fr')) return 'fr';
    if (tag.startsWith('de')) return 'de';
    if (tag.startsWith('ja')) return 'ja';
  }
  return DEFAULT_LOCALE;
}

export const LOCALE_COOKIE = 'aa-locale';
export const LOCALE_COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

/** Remove o prefixo de locale de um pathname. `/en/ensaios` → `/ensaios`. */
export function stripLocale(pathname: string): { locale: Locale | null; rest: string } {
  for (const loc of LOCALES) {
    if (pathname === `/${loc}`) return { locale: loc, rest: '/' };
    if (pathname.startsWith(`/${loc}/`)) return { locale: loc, rest: pathname.slice(loc.length + 1) };
  }
  return { locale: null, rest: pathname };
}

/** Constrói um href com prefixo de locale. `localeHref('/ensaios','en')` → `/en/ensaios`. */
export function localeHref(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`;
}

export const SITE_URL = 'https://andreambrosio.com';

/** Gera o objeto `alternates.languages` (hreflang) para uma rota canônica (sem locale). */
export function hreflangAlternates(canonicalPath: string): Record<string, string> {
  const clean = canonicalPath === '/' ? '' : canonicalPath;
  const out: Record<string, string> = {};
  for (const loc of LOCALES) {
    out[LOCALE_META[loc].hreflang] = `${SITE_URL}/${loc}${clean}`;
  }
  out['x-default'] = `${SITE_URL}/${DEFAULT_LOCALE}${clean}`;
  return out;
}
