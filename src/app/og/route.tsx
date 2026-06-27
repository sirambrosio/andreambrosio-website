import { ImageResponse } from 'next/og';

export const runtime = 'edge';

/** Card social 1200×630, branded. Params: ?title=&subtitle=&tag= */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get('title') || 'Andre Ambrósio').slice(0, 110);
  const subtitle = (searchParams.get('subtitle') || 'Arquitetura da mudança').slice(0, 150);
  const tag = (searchParams.get('tag') || '').slice(0, 40);

  try {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #151A1A 0%, #0B0F0F 100%)',
          padding: '72px',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '2px', background: '#C9A961' }} />
          <div style={{ fontSize: 22, letterSpacing: '6px', textTransform: 'uppercase', color: '#C9A961', fontFamily: 'monospace' }}>
            {tag || 'andreambrosio.com'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ fontSize: 68, lineHeight: 1.05, color: '#F0EBDF', fontWeight: 400, letterSpacing: '-1px' }}>
            {title}
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.4, color: 'rgba(192,196,196,0.75)' }}>{subtitle}</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ fontSize: 26, color: '#F0EBDF', fontWeight: 400 }}>Andre Ambrósio</div>
          <div style={{ fontSize: 18, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(201,169,97,0.85)', fontFamily: 'monospace' }}>
            Tecnologia · Negócios · Saúde · IA
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
  } catch {
    return new ImageResponse(
      <div style={{ width: '1200px', height: '630px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#151A1A', color: '#F0EBDF', fontSize: 64, fontFamily: 'Georgia, serif' }}>Andre Ambrósio</div>,
      { width: 1200, height: 630 },
    );
  }
}
