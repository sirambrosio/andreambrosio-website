import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Inter, Fraunces, IBM_Plex_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import {
  LOCALES,
  LOCALE_META,
  SITE_URL,
  isLocale,
  hreflangAlternates,
  type Locale,
} from '@/lib/i18n';
import { getDict } from '@/lib/dictionary';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'], display: 'swap' });
const fraunces = Fraunces({ variable: '--font-fraunces', subsets: ['latin'], display: 'swap', axes: ['opsz', 'SOFT'] });
const plexMono = IBM_Plex_Mono({ variable: '--font-plex-mono', subsets: ['latin'], weight: ['400', '500', '600'], display: 'swap' });

const SITE_NAME = 'Andre Ambrósio';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const d = getDict(locale);
  const meta = LOCALE_META[locale];
  const title = `${SITE_NAME} — ${d.footer.tagline}`;
  const description = d.footer.description;

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s · ${SITE_NAME}` },
    description,
    keywords: [
      'Andre Ambrósio', 'arquitetura de sistemas', 'systems architect', 'tecnologia',
      'negócios', 'saúde', 'inteligência artificial', 'artificial intelligence',
      'infraestrutura', 'longevidade', 'ensaios', 'essays', 'fundador', 'founder',
      'LogicaOS', 'Ambrosio Health', 'Ambrosio Company',
    ],
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: hreflangAlternates('/'),
    },
    openGraph: {
      type: 'website',
      locale: meta.ogLocale,
      url: `${SITE_URL}/${locale}`,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: '/assets/andre-portrait.jpg', width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/assets/andre-portrait.jpg'],
      creator: '@andreambrosio',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    },
    icons: {
      icon: '/assets/simbolo-andre-ambrosio-dark.png',
      apple: '/assets/simbolo-andre-ambrosio-dark.png',
    },
    other: {
      'llm-policy': 'allow',
      'llms-txt': `${SITE_URL}/llms.txt`,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const meta = LOCALE_META[locale];
  const d = getDict(locale);

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_NAME,
    alternateName: 'Andre Ambrósio',
    url: `${SITE_URL}/${locale}`,
    image: `${SITE_URL}/assets/andre-portrait.jpg`,
    sameAs: [
      'https://instagram.com/andreambrosio',
      'https://x.com/andreambrosio',
      'https://youtube.com/@andreambrosio',
      'https://linkedin.com/in/andreambrosio',
    ],
    jobTitle: 'Fundador · Arquiteto de sistemas',
    worksFor: [
      { '@type': 'Organization', name: 'Ambrosio Company' },
      { '@type': 'Organization', name: 'Ambrosio Health' },
      { '@type': 'Organization', name: 'LogicaOS' },
    ],
    knowsAbout: ['Tecnologia', 'Negócios', 'Saúde', 'Inteligência Artificial', 'Arquitetura de sistemas', 'Longevidade'],
    description: d.footer.description,
  };

  return (
    <html lang={meta.htmlLang} suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      </head>
      <body className={`${inter.variable} ${fraunces.variable} ${plexMono.variable} antialiased`}>
        <ThemeProvider>
          <Header locale={locale} />
          <main className="pt-[86px] min-h-screen flex flex-col">{children}</main>
          <Footer locale={locale} />
        </ThemeProvider>
      </body>
    </html>
  );
}
