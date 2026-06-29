import { NextRequest, NextResponse } from 'next/server';
import {
  isLocale,
  detectLocaleFromHeader,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  type Locale,
} from './lib/i18n';
import { canonicalizePath, localizePath } from './lib/route-translations';

/**
 * i18n routing com slugs traduzidos:
 *  - `/{locale}/{slug-localizado}` → rewrite p/ rota canônica interna `/{locale}/{slug-canônico}`.
 *  - `/{locale}/{slug-canônico}` (forma pt sob outro locale) → 307 p/ forma localizada.
 *  - `/algo` (sem prefixo) → 307 p/ `/{locale}/{localizado}` (cookie > Accept-Language).
 * Paths com `.` (assets/robots/sitemap/llms/mcp/manifest/feed), _next, api e og ficam de fora pelo matcher.
 */
function setLocaleCookie(res: NextResponse, locale: Locale) {
  res.cookies.set(LOCALE_COOKIE, locale, { path: '/', maxAge: LOCALE_COOKIE_MAX_AGE, sameSite: 'lax' });
  return res;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // ── domínio de tracking: track.andreambrosio.com/{slug} → handler /l/{slug} ──
  const host = (request.headers.get('host') || '').toLowerCase();
  if (host.startsWith('track.')) {
    const slug = pathname.replace(/^\//, '');
    if (!slug || slug === 'favicon.ico') return NextResponse.redirect('https://andreambrosio.com');
    const u = request.nextUrl.clone();
    u.pathname = `/l/${slug}`;
    return NextResponse.rewrite(u);
  }
  const firstSeg = pathname.split('/')[1];

  // ── já tem prefixo de locale ──────────────────────────────────────────────
  if (isLocale(firstSeg)) {
    const locale = firstSeg as Locale;
    const restRaw = pathname === `/${locale}` ? '/' : pathname.slice(locale.length + 1);
    // segmentos CJK/ru chegam percent-encoded — decodifica p/ casar com o mapa
    let rest = restRaw;
    try { rest = decodeURIComponent(restRaw); } catch { /* mantém raw */ }

    const canonical = canonicalizePath(rest, locale);
    const expected = localizePath(canonical, locale);

    // URL veio em forma canônica onde há forma localizada → redirect p/ localizada
    if (expected !== rest) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}${expected === '/' ? '' : expected}`;
      url.search = search;
      return setLocaleCookie(NextResponse.redirect(url), locale);
    }

    // rewrite p/ rota canônica interna (estrutura física do app/)
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${canonical === '/' ? '' : canonical}`;
    // sem Set-Cookie aqui: é resposta cacheável (rewrite de página estática) — evita CDN servir cookie de outro locale
    return NextResponse.rewrite(url);
  }

  // ── sem prefixo → escolhe locale e redireciona (com slug localizado) ───────
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale: Locale = isLocale(cookie) ? cookie : detectLocaleFromHeader(request.headers.get('accept-language'));

  // valida o primeiro segmento — evita fabricar /{locale}/<lixo> → 404 (polui índice)
  const KNOWN_FIRST = new Set(['sobre', 'campos', 'ensaios', 'empresas', 'links', 'buscar', 'contato', 'privacidade', 'painel', 'agora']);
  const firstSegNoPrefix = canonicalizePath(pathname, locale).split('/')[1];
  if (firstSegNoPrefix && !KNOWN_FIRST.has(firstSegNoPrefix)) {
    const u = request.nextUrl.clone();
    u.pathname = `/${locale}`;
    return setLocaleCookie(NextResponse.redirect(u), locale);
  }

  const localized = localizePath(pathname, locale);
  const url = request.nextUrl.clone();
  url.pathname = pathname === '/' ? `/${locale}` : `/${locale}${localized}`;
  url.search = search;
  return setLocaleCookie(NextResponse.redirect(url), locale);
}

export const config = {
  // Tudo exceto: _next, api, og (route de imagem), e qualquer path com ponto
  matcher: ['/((?!_next|api|og|admin|l|.*\\.).*)'],
};
