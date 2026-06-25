import { getDict } from '@/lib/dictionary';
import { getSearchIndex } from '@/lib/search';
import { localeHref, type Locale } from '@/lib/i18n';
import { HeaderClient } from './HeaderClient';

export function Header({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const docs = getSearchIndex(locale);

  const nav = [
    { href: localeHref('/sobre', locale), label: d.nav.sobre },
    { href: localeHref('/campos', locale), label: d.nav.campos },
    { href: localeHref('/ensaios', locale), label: d.nav.ensaios },
    { href: localeHref('/empresas', locale), label: d.nav.empresas },
  ];

  return (
    <HeaderClient
      locale={locale}
      homeHref={localeHref('/', locale)}
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
      }}
    />
  );
}
