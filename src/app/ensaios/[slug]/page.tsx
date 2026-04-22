import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllEnsaios, getEnsaio, CAMPOS } from '@/lib/ensaios';
import { ArrowLeft } from 'lucide-react';

export function generateStaticParams() {
  return getAllEnsaios().map(e => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = getEnsaio(slug);
  if (!e) return {};
  const campo = CAMPOS[e.campo];
  return {
    title: e.titulo,
    description: e.resumo,
    openGraph: {
      type: 'article',
      title: e.titulo,
      description: e.resumo,
      publishedTime: e.data,
      authors: ['Andre Ambrósio'],
      tags: [campo.nome],
      images: e.imagem ? [e.imagem] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: e.titulo,
      description: e.resumo,
    },
  };
}

const mdxComponents = {
  h1: (p: React.HTMLAttributes<HTMLHeadingElement>) => <h1 {...p} className="font-display font-light text-[clamp(2rem,3.5vw,3rem)] leading-[1.05] tracking-tight text-text mt-16 mb-6" />,
  h2: (p: React.HTMLAttributes<HTMLHeadingElement>) => <h2 {...p} className="font-display font-light text-[clamp(1.5rem,2.5vw,2rem)] leading-[1.15] tracking-tight text-text mt-14 mb-5" />,
  h3: (p: React.HTMLAttributes<HTMLHeadingElement>) => <h3 {...p} className="font-display font-normal text-[1.375rem] leading-[1.25] text-text mt-10 mb-4 tracking-tight" />,
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

export default async function EnsaioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = getEnsaio(slug);
  if (!e) notFound();

  const campo = CAMPOS[e.campo];

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: e.titulo,
    description: e.resumo,
    author: { '@type': 'Person', name: 'Andre Ambrósio' },
    datePublished: e.data,
    articleSection: campo.nome,
    url: `https://andreambrosio.com/ensaios/${e.slug}`,
    image: e.imagem ? `https://andreambrosio.com${e.imagem}` : undefined,
  };

  return (
    <article className="bg-bg text-text min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      {/* HERO */}
      <header className="relative px-6 md:px-[8rem] pt-24 pb-20 overflow-hidden border-b border-border">
        {e.imagem && (
          <div className="absolute inset-0 opacity-[0.14] pointer-events-none">
            <Image src={e.imagem} alt="" fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(var(--overlay-fade),0.4) 0%, rgba(var(--overlay-fade),0.92) 70%, var(--bg) 100%)' }} />
          </div>
        )}
        <div className="relative max-w-[820px] mx-auto">
          <Link href="/ensaios" className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.25em] uppercase text-text-dim hover:text-champagne transition-colors mb-8">
            <ArrowLeft size={12} /> Ensaios
          </Link>
          <div className="flex items-center gap-4 mb-8 text-[11px] font-mono tracking-[0.2em] uppercase">
            <Link href={`/campos/${campo.slug}`} className="text-champagne hover:text-text transition-colors">{campo.nome}</Link>
            <span className="text-text-dimmer">·</span>
            <span className="text-text-dimmer">{e.data}</span>
            <span className="text-text-dimmer">·</span>
            <span className="text-text-dimmer">{e.tempo_leitura} min de leitura</span>
          </div>
          <h1 className="font-display font-light text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.025em] text-text mb-6">
            {e.titulo}
          </h1>
          {e.subtitulo && (
            <p className="font-display italic text-[clamp(1.125rem,1.75vw,1.5rem)] leading-[1.4] text-text-dim max-w-[680px]">
              {e.subtitulo}
            </p>
          )}
        </div>
      </header>

      {/* CONTENT */}
      <section className="px-6 md:px-[8rem] py-20">
        <div className="max-w-[720px] mx-auto prose-editorial">
          <MDXRemote source={e.conteudo} components={mdxComponents} />
        </div>
      </section>

      {/* FOOTER ARTIGO */}
      <footer className="px-6 md:px-[8rem] py-20 bg-surface border-t border-border">
        <div className="max-w-[720px] mx-auto">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-bronze mb-8 text-center">— Fim do ensaio —</div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link href={`/campos/${campo.slug}`} className="text-[12px] font-mono font-semibold tracking-[0.25em] uppercase text-text-dim hover:text-champagne transition-colors">
              ← Mais em {campo.nome}
            </Link>
            <Link href="/ensaios" className="inline-flex items-center gap-3 text-[12px] font-mono font-semibold tracking-[0.25em] uppercase text-champagne hover:text-text transition-colors group">
              Todos os ensaios
              <span className="w-[24px] h-[1px] bg-current transition-all group-hover:w-[48px]" />
            </Link>
          </div>
        </div>
      </footer>
    </article>
  );
}
