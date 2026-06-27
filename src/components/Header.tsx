import { getDict } from '@/lib/dictionary';
import { getSearchIndex } from '@/lib/search';
import { getCampos } from '@/lib/content';
import { type Locale } from '@/lib/i18n';
import { localeHref } from '@/lib/route-translations';
import { HeaderClient } from './HeaderClient';
import { CONTATO } from '@/lib/legal';

export function Header({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const docs = getSearchIndex(locale);
  const campos = getCampos(locale);

  const nav = [
    { href: localeHref('/', locale), label: d.nav.inicio },
    { href: localeHref('/sobre', locale), label: d.nav.sobre },
    {
      href: localeHref('/campos', locale),
      label: d.nav.campos,
      children: campos.map((c) => ({
        href: localeHref(`/campos/${c.slug}`, locale),
        label: c.nome,
        sub: c.subtitulo,
      })),
    },
    { href: localeHref('/ensaios', locale), label: d.nav.ensaios },
    { href: localeHref('/empresas', locale), label: d.nav.empresas },
    { href: localeHref('/contato', locale), label: CONTATO.eyebrow[locale] },
  ];

  return (
    <HeaderClient
      locale={locale}
      homeHref={localeHref('/', locale)}
      heroHref={localeHref('/ensaios', locale)}
      nav={nav}
      docs={docs}
      spotlight={d.spotlight}
      t={{
        homeLabel: d.header.homeLabel,
        openMenu: d.header.openMenu,
        closeMenu: d.header.closeMenu,
        toggleTheme: d.header.toggleTheme,
        lightMode: d.header.lightMode,
        darkMode: d.header.darkMode,
        language: d.header.language,
        search: d.header.search,
      }}
    />
  );
}
