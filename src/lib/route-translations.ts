/**
 * Tradução de slugs por idioma (SEO/GEO).
 * Canônico = pt (estrutura física em app/[locale]/...). Cada locale tem URLs
 * com palavras-chave do próprio idioma; o middleware reescreve a URL localizada
 * de volta para a rota canônica interna.
 *
 * Edge-safe: importado pelo middleware. Só importa tipos/const de i18n.
 */
import { LOCALES, DEFAULT_LOCALE, LOCALE_META, SITE_URL, type Locale } from './i18n';

type SegMap = Partial<Record<Locale, string>>;

/**
 * canônico → { locale: slug-traduzido }. Segmentos ausentes num locale caem no
 * canônico. CJK/ru usam o script nativo (melhor SEO local).
 */
const SEGMENT_TRANSLATIONS: Record<string, SegMap> = {
  // ── seções ──────────────────────────────────────────────────────────────
  sobre:    { en: 'about',     es: 'acerca',   fr: 'a-propos',   de: 'ueber-mich', ja: '概要',   zh: '关于', ru: 'обо-мне' },
  campos:   { en: 'fields',    es: 'campos',   fr: 'champs',     de: 'felder',     ja: '領域',   zh: '领域', ru: 'поля' },
  ensaios:  { en: 'essays',    es: 'ensayos',  fr: 'essais',     de: 'essays',     ja: 'エッセイ', zh: '文章', ru: 'эссе' },
  empresas: { en: 'companies', es: 'empresas', fr: 'entreprises', de: 'unternehmen', ja: '事業', zh: '企业', ru: 'компании' },
  buscar:   { en: 'search',    es: 'buscar',   fr: 'recherche',  de: 'suche',      ja: '検索',   zh: '搜索', ru: 'поиск' },

  // ── slugs de campo ──────────────────────────────────────────────────────
  tecnologia: { en: 'technology', es: 'tecnologia', fr: 'technologie', de: 'technologie', ja: 'テクノロジー', zh: '科技', ru: 'технологии' },
  negocios:   { en: 'business',   es: 'negocios',   fr: 'affaires',    de: 'wirtschaft',  ja: 'ビジネス',     zh: '商业', ru: 'бизнес' },
  saude:      { en: 'health',     es: 'salud',      fr: 'sante',       de: 'gesundheit',  ja: '健康',         zh: '健康', ru: 'здоровье' },
  ia:         { en: 'artificial-intelligence', es: 'inteligencia-artificial', fr: 'intelligence-artificielle', de: 'kuenstliche-intelligenz', ja: '人工知能', zh: '人工智能', ru: 'искусственный-интеллект' },

  // ── slugs de ensaio ─────────────────────────────────────────────────────
};

// reverse: locale → { slug-traduzido: canônico }
const REVERSE_BY_LOCALE: Record<Locale, Record<string, string>> = LOCALES.reduce((acc, loc) => {
  acc[loc] = {};
  for (const [canonical, map] of Object.entries(SEGMENT_TRANSLATIONS)) {
    const translated = map[loc] ?? canonical;
    acc[loc][translated] = canonical;
  }
  return acc;
}, {} as Record<Locale, Record<string, string>>);

/** path canônico → slug localizado. `/campos/tecnologia` (en) → `/fields/technology` */
export function localizePath(canonicalPath: string, locale: Locale): string {
  if (canonicalPath === '/') return '/';
  const segs = canonicalPath.split('/').filter(Boolean);
  return '/' + segs.map((s) => SEGMENT_TRANSLATIONS[s]?.[locale] ?? s).join('/');
}

/** path localizado → canônico. `/fields/technology` (en) → `/campos/tecnologia` */
export function canonicalizePath(localizedPath: string, locale: Locale): string {
  if (localizedPath === '/') return '/';
  const rev = REVERSE_BY_LOCALE[locale] ?? {};
  const segs = localizedPath.split('/').filter(Boolean);
  return '/' + segs.map((s) => rev[s] ?? s).join('/');
}

/** href público com prefixo de locale e slugs traduzidos. */
export function localeHref(canonicalPath: string, locale: Locale): string {
  const clean = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
  const localized = localizePath(clean, locale);
  return localized === '/' ? `/${locale}` : `/${locale}${localized}`;
}

/** URL pública absoluta (locale + slugs traduzidos), com não-ASCII percent-encoded. */
export function localeUrl(canonicalPath: string, locale: Locale): string {
  return encodeURI(`${SITE_URL}${localeHref(canonicalPath, locale)}`);
}

/** alternates.languages (hreflang) com URLs localizadas para uma rota canônica. */
export function hreflangAlternates(canonicalPath: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const loc of LOCALES) {
    out[LOCALE_META[loc].hreflang] = localeUrl(canonicalPath, loc);
  }
  out['x-default'] = localeUrl(canonicalPath, DEFAULT_LOCALE);
  return out;
}
