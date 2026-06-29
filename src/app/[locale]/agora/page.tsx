import type { Metadata } from 'next';
import { asLocale, isLocale, type Locale } from '@/lib/i18n';
import { localeHref, hreflangAlternates } from '@/lib/route-translations';
import { getPool, getConfig } from '@/lib/admin-data';

export const revalidate = 60;

const T = {
  eyebrow: { pt: 'Agora', en: 'Now', es: 'Ahora', zh: '现在', fr: 'Maintenant', de: 'Jetzt', ja: '現在', ru: 'Сейчас' },
  title: { pt: 'No que estou focado', en: "What I'm focused on", es: 'En qué estoy enfocado', zh: '我正在专注的事', fr: 'Ce sur quoi je me concentre', de: 'Worauf ich mich konzentriere', ja: '今、集中していること', ru: 'На чём я сосредоточен' },
  lead: { pt: 'Uma janela honesta para o presente — projetos, ideias e obsessões deste momento.', en: 'An honest window into the present — projects, ideas and obsessions of this moment.', es: 'Una ventana honesta al presente — proyectos, ideas y obsesiones de este momento.', zh: '一扇通往当下的诚实窗口——此刻的项目、想法与执着。', fr: 'Une fenêtre honnête sur le présent — projets, idées et obsessions du moment.', de: 'Ein ehrlicher Blick auf die Gegenwart — Projekte, Ideen und Obsessionen dieses Moments.', ja: '現在への正直な窓 — 今この瞬間のプロジェクト、アイデア、こだわり。', ru: 'Честное окно в настоящее — проекты, идеи и одержимости этого момента.' },
  empty: { pt: 'Em breve.', en: 'Coming soon.', es: 'Próximamente.', zh: '即将推出。', fr: 'Bientôt.', de: 'Demnächst.', ja: '近日公開。', ru: 'Скоро.' },
  updated: { pt: 'Atualizado em', en: 'Updated on', es: 'Actualizado el', zh: '更新于', fr: 'Mis à jour le', de: 'Aktualisiert am', ja: '更新日', ru: 'Обновлено' },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const l = raw as Locale;
  return {
    title: `${T.eyebrow[l]} — Andre Ambrósio`,
    description: T.lead[l],
    alternates: { canonical: localeHref('/agora', l), languages: hreflangAlternates('/agora') },
  };
}

export default async function Agora({ params }: { params: Promise<{ locale: string }> }) {
  const locale: Locale = asLocale((await params).locale);
  const db = getPool();
  const content = db ? ((await getConfig(db, 'now_content')) ?? '') : '';
  const updated = db ? await getConfig(db, 'now_updated') : null;
  const paras = content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className="bg-bg text-text min-h-screen">
      <section className="px-6 md:px-[8rem] pt-28 md:pt-36 pb-16 border-b border-border">
        <div className="max-w-[760px]">
          <div className="flex items-center gap-3 mb-9">
            <div className="w-[40px] h-[1px] bg-champagne" />
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-champagne">{T.eyebrow[locale]}</span>
          </div>
          <h1 className="font-display font-light text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.98] text-gold-foil mb-7 tracking-tight">{T.title[locale]}</h1>
          <p className="text-[1.0625rem] text-text-dim leading-[1.85] max-w-[560px]">{T.lead[locale]}</p>
        </div>
      </section>

      <section className="px-6 md:px-[8rem] py-16 md:py-20">
        <div className="max-w-[680px]">
          {paras.length === 0 ? (
            <p className="text-[1.0625rem] text-text-dimmer italic">{T.empty[locale]}</p>
          ) : (
            <div className="space-y-6">
              {paras.map((p, i) => (
                <p key={i} className="text-[1.125rem] text-text leading-[1.85] whitespace-pre-line">{p}</p>
              ))}
            </div>
          )}
          {updated && (
            <p className="mt-12 pt-6 border-t border-border font-mono text-[10px] tracking-[0.25em] uppercase text-bronze">
              {T.updated[locale]} {updated}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
