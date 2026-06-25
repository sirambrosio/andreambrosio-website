import { NextRequest, NextResponse } from 'next/server';
import {
  isLocale,
  detectLocaleFromHeader,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  type Locale,
} from './lib/i18n';

/**
 * i18n routing:
 *  - `/algo` (sem prefixo) → 307 redirect pra `/{locale}/algo` (cookie > Accept-Language).
 *  - `/{locale}/algo` → segue, gravando o cookie de preferência.
 * Rotas com `.` (assets, robots.txt, sitemap.xml, llms.txt, mcp.json) e _next/api
 * ficam de fora pelo matcher abaixo.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const firstSeg = pathname.split('/')[1];

  // Já tem prefixo de locale válido → segue + grava cookie
  if (isLocale(firstSeg)) {
    const res = NextResponse.next();
    res.cookies.set(LOCALE_COOKIE, firstSeg, {
      path: '/',
      maxAge: LOCALE_COOKIE_MAX_AGE,
      sameSite: 'lax',
    });
    return res;
  }

  // Sem prefixo → escolhe locale e redireciona
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale: Locale = isLocale(cookie)
    ? cookie
    : detectLocaleFromHeader(request.headers.get('accept-language'));

  const url = request.nextUrl.clone();
  url.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
  url.search = search;

  const res = NextResponse.redirect(url);
  res.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: 'lax',
  });
  return res;
}

export const config = {
  // Tudo exceto: _next, api, og (route de imagem), e qualquer path com ponto
  // (assets/robots/sitemap/llms/mcp/manifest/feed)
  matcher: ['/((?!_next|api|og|.*\\.).*)'],
};
