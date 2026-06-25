import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllEnsaios, getEnsaio } from '@/lib/ensaios';
import { campoNome, getEnsaioExtra } from '@/lib/content';
import { getDict } from '@/lib/dictionary';
import { asLocale, isLocale, SITE_URL, type Locale } from '@/lib/i18n';
import { localeHref, localeUrl, hreflangAlternates } from '@/lib/route-translations';
import { ArrowLeft } from 'lucide-react';
import { ReadingProgress } from '@/components/ReadingProgress';
import { ArticleTOC } from '@/components/journal/ArticleTOC';
import { KeyTakeaways } from '@/components/journal/KeyTakeaways';
import { ArticleFAQ } from '@/components/journal/ArticleFAQ';
import { AuthorCard } from '@/components/journal/AuthorCard';
import { ShareButtons } from '@/components/journal/ShareButtons';
import { NewsletterCapture } from '@/components/NewsletterCapture';

const L = {
  toc: { pt: 'Índice', en: 'Contents', es: 'Contenido', zh: '目录', fr: 'Sommaire', de: 'Inhalt', ja: '目次', ru: 'Содержание' },
  takeaways: { pt: 'Pontos-chave', en: 'Key points', es: 'Puntos clave', zh: '要点', fr: 'Points clés', de: 'Kernpunkte', ja: '要点', ru: 'Ключевые мысли' },
  faq: { pt: 'Perguntas frequentes', en: 'FAQ', es: 'Preguntas frecuentes', zh: '常见问题', fr: 'Questions fréquentes', de: 'Häufige Fragen', ja: 'よくある質問', ru: 'Частые вопросы' },
  author: { pt: 'Sobre o autor', en: 'About the author', es: 'Sobre el autor', zh: '关于作者', fr: "À propos de l'auteur", de: 'Über den Autor', ja: '著者について', ru: 'Об авторе' },
  share: { pt: 'Compartilhar', en: 'Share', es: 'Compartir', zh: '分享', fr: 'Partager', de: 'Teilen', ja: 'シェア', ru: 'Поделиться' },
} as const;
const lab = (k: keyof typeof L, l: Locale) => L[k][l];

const slug = (s: string) =>
  s.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '') || 'secao';

function textOf(c: unknown): string {
  if (typeof c === 'string') return c;
  if (Array.isArray(c)) return c.map(textOf).join('');
  if (c && typeof c === 'object' && 'props' in c) return textOf((c as { props?: { children?: unknown } }).props?.children);
  return '';
}

export function generateStaticParams() {
  return getAllEnsaios().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: raw, slug: s } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const e = getEnsaio(s, locale);
  if (!e) return {};
  const tag = campoNome(e.campo, locale);
  const og = `/og?title=${encodeURIComponent(e.titulo)}&subtitle=${encodeURIComponent(e.subtitulo ?? '')}&tag=${encodeURIComponent(tag)}`;
  return {
    title: e.titulo,
    description: e.resumo,
    alternates: { canonical: localeHref(`/ensaios/${s}`, locale), languages: hreflangAlternates(`/ensaios/${s}`) },
    openGraph: {
      type: 'article',
      title: e.titulo,
      description: e.resumo,
      publishedTime: e.data,
      authors: ['Andre Ambrósio'],
      tags: [tag],
      images: [{ url: og, width: 1200, height: 630, alt: e.titulo }],
    },
    twitter: { card: 'summary_large_image', title: e.titulo, description: e.resumo, images: [og] },
  };
}

const mdxComponents = {
  h1: (p: React.HTMLAttributes<HTMLHeadingElement>) => <h1 {...p} className="font-display font-light text-[clamp(2rem,3.5vw,3rem)] leading-[1.05] tracking-tight text-text mt-16 mb-6" />,
  h2: (p: React.HTMLAttributes<HTMLHeadingElement>) => <h2 id={slug(textOf(p.children))} {...p} className="font-display font-light text-[clamp(1.5rem,2.5vw,2rem)] leading-[1.15] tracking-tight text-text mt-14 mb-5 scroll-mt-[110px]" />,
  h3: (p: React.HTMLAttributes<HTMLHeadingElement>) => <h3 id={slug(textOf(p.children))} {...p} className="font-display font-normal text-[1.375rem] leading-[1.25] text-text mt-10 mb-4 tracking-tight scroll-mt-[110px]" />,
  p: (p: React.HTMLAttributes<HTMLParagraphElement>) => <p {...p} className="text-[1.0625rem] leading-[1.85] text-text mb-6 font-body" />,
  ul: (p: React.HTMLAttributes<HTMLUListElement>) => <ul {...p} className="space-y-3 mb-8 text-[1.0625rem] leading-[1.8] text-text pl-6 [&>li]:list-disc [&>li]:marker:text-champagne" />,
  ol: (p: React.HTMLAttributes<HTMLOListElement>) => <ol {...p} className="space-y-3 mb-8 text-[1.0625rem] leading-[1.8] text-text pl-6 [&>li]:list-decimal [&>li]:marker:text-champagne" />,
  li: (p: React.HTMLAttributes<HTMLLIElement>) => <li {...p} className="pl-2" />,
  blockquote: (p: React.HTMLAttributes<HTMLQuoteElement>) => <blockquote {...p} className="font-display italic text-[1.25rem] leading-[1.5] text-text-dim border-l-2 border-champagne pl-6 my-10" />,
  a: (p: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...p} className="text-champagne underline hover:no-underline" />,
  strong: (p: React.HTMLAttributes<HTMLElement>) => <strong {...p} className="font-semibold text-text" />,
  em: (p: React.HTMLAttributes<HTMLElement>) => <em {...p} className="italic" />,
  code: (p: React.HTMLAttributes<HTMLElement>) => <code {...p} className="font-mono text-[0.875em] bg-surface-alt px-1.5 py-0.5 rounded text-champagne" />,
  hr: () => <hr className="my-14 border-0 hairline" />,
};

export default async function EnsaioPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug: s } = await params;
  const locale: Locale = asLocale(rawLocale);
  const d = getDict(locale);
  const e = getEnsaio(s, locale);
  if (!e) notFound();

  const campo = campoNome(e.campo, locale);
  const extra = getEnsaioExtra(e.slug, locale);
  const articleUrl = localeUrl(`/ensaios/${e.slug}`, locale);

  // índice (TOC) a partir dos H2 do corpo
  const toc = Array.from(e.conteudo.matchAll(/^##\s+(.+)$/gm)).map((m) => {
    const text = m[1].trim();
    return { id: slug(text), text };
  });

  const all = getAllEnsaios(locale).filter((x) => x.slug !== e.slug);
  const related = [...all.filter((x) => x.campo === e.campo), ...all.filter((x) => x.campo !== e.campo)].slice(0, 2);
  const relatedLabel = ({ pt: 'Continue lendo', en: 'Keep reading', es: 'Sigue leyendo', zh: '继续阅读', fr: 'Continuez la lecture', de: 'Weiterlesen', ja: '続けて読む', ru: 'Продолжить чтение' } as Record<Locale, string>)[locale];

  const articleSchema = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: e.titulo, description: e.resumo, inLanguage: 'pt-BR',
    author: { '@type': 'Person', name: 'Andre Ambrósio' },
    datePublished: e.data, articleSection: campo, url: articleUrl,
    image: e.imagem ? `${SITE_URL}${e.imagem}` : undefined,
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: d.nav.inicio, item: localeUrl('/', locale) },
      { '@type': 'ListItem', position: 2, name: d.nav.ensaios, item: localeUrl('/ensaios', locale) },
      { '@type': 'ListItem', position: 3, name: e.titulo, item: articleUrl },
    ],
  };
  const faqSchema = extra?.faq?.length
    ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: extra.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
    : null;

  return (
    <article className="bg-bg text-text min-h-screen">
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      {/* HERO */}
      <header className="relative px-6 md:px-[8rem] pt-24 pb-20 overflow-hidden border-b border-border">
        {e.imagem && (
          <div className="absolute inset-0 opacity-[0.14] pointer-events-none">
            <Image src={e.imagem} alt="" fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(var(--overlay-fade),0.4) 0%, rgba(var(--overlay-fade),0.92) 70%, var(--bg) 100%)' }} />
          </div>
        )}
        <div className="relative max-w-[820px] mx-auto">
          <Link href={localeHref('/ensaios', locale)} className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.25em] uppercase text-text-dim hover:text-champagne transition-colors mb-8">
            <ArrowLeft size={12} /> {d.ensaios.voltar}
          </Link>
          <div className="flex items-center gap-4 mb-8 text-[11px] font-mono tracking-[0.2em] uppercase flex-wrap">
            <Link href={localeHref(`/campos/${e.campo}`, locale)} className="text-champagne hover:text-text transition-colors">{campo}</Link>
            <span className="text-text-dimmer">·</span>
            <span className="text-text-dimmer">{e.data}</span>
            <span className="text-text-dimmer">·</span>
            <span className="text-text-dimmer">{e.tempo_leitura} {d.ensaios.minLeitura}</span>
          </div>
          <h1 className="font-display font-light text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.025em] text-text mb-6">{e.titulo}</h1>
          {e.subtitulo && <p className="font-display italic text-[clamp(1.125rem,1.75vw,1.5rem)] leading-[1.4] text-text-dim max-w-[680px]">{e.subtitulo}</p>}
          {e.metaLocalized && (
            <p className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-bronze border border-bronze/30 rounded-full px-3 py-1">
              🇧🇷 {d.ensaios.originalNote}
            </p>
          )}
        </div>
      </header>

      {/* CORPO (TOC lateral + artigo) */}
      <section className="px-6 md:px-10 py-16">
        <div className="max-w-[1060px] mx-auto lg:grid lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-14">
          <ArticleTOC items={toc} label={lab('toc', locale)} />
          <div className="max-w-[720px]">
            <KeyTakeaways items={extra?.takeaways ?? []} label={lab('takeaways', locale)} />
            <div className="prose-editorial">
              <MDXRemote source={e.conteudo} components={mdxComponents} />
            </div>
            <ShareButtons url={articleUrl} title={e.titulo} label={lab('share', locale)} />
            <ArticleFAQ faqs={extra?.faq ?? []} label={lab('faq', locale)} />
            <AuthorCard label={lab('author', locale)} bio={d.sobre.lead} />
          </div>
        </div>
      </section>

      {/* RELACIONADOS */}
      {related.length > 0 && (
        <section className="px-6 md:px-[8rem] py-16 border-t border-border">
          <div className="max-w-[820px] mx-auto">
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-bronze mb-8">{relatedLabel}</div>
            <div className="grid md:grid-cols-2 gap-4">
              {related.map((r) => (
                <Link key={r.slug} href={localeHref(`/ensaios/${r.slug}`, locale)} className="group rounded-[18px] border border-border bg-surface p-7 hover:border-champagne transition-all">
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-champagne mb-3">{campoNome(r.campo, locale)}</div>
                  <h3 className="font-display font-light text-[1.375rem] leading-[1.2] text-text tracking-tight group-hover:text-champagne transition-colors mb-2">{r.titulo}</h3>
                  {r.subtitulo && <p className="text-[13px] text-text-dim leading-relaxed">{r.subtitulo}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NEWSLETTER CTA */}
      <section className="px-6 md:px-[8rem] py-20 bg-surface border-t border-border">
        <div className="max-w-[820px] mx-auto">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-bronze mb-8 text-center">{d.ensaios.fim}</div>
          <div className="rounded-[24px] border border-champagne/20 bg-bg p-8 md:p-10 text-center">
            <h2 className="font-display font-light text-[clamp(1.5rem,2.5vw,2.25rem)] text-text tracking-tight mb-2">{d.footer.newsletterTitle}</h2>
            <p className="text-[14px] text-text-dim mb-6 max-w-[480px] mx-auto">{d.footer.newsletterLead}</p>
            <div className="flex justify-center">
              <NewsletterCapture variant="hero" labels={{ placeholder: d.footer.newsletterPlaceholder, submit: d.footer.newsletterSubmit, success: d.footer.newsletterSuccess, error: d.footer.newsletterError }} />
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
