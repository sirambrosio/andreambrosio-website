import Link from 'next/link';

/**
 * Root not-found — documento completo (o root layout é pass-through, sem html/body).
 * Cobre o /_not-found do framework e paths sem prefixo de locale. Neutro (PT · EN).
 */
export default function RootNotFound() {
  return (
    <html lang="pt">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#151A1A',
          color: '#F0EBDF',
          fontFamily: 'ui-serif, Georgia, serif',
          textAlign: 'center',
          padding: '24px',
        }}
      >
        <div style={{ maxWidth: 520 }}>
          <div style={{ fontSize: 'clamp(5rem,18vw,11rem)', lineHeight: 1, color: '#C9A961', fontWeight: 300 }}>404</div>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'rgba(192,196,196,0.72)', marginTop: 16 }}>
            Página não encontrada · Page not found
          </p>
          <p style={{ marginTop: 28 }}>
            <Link href="/" style={{ color: '#C9A961', textDecoration: 'none', fontFamily: 'ui-monospace, monospace', fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Andre Ambrósio →
            </Link>
          </p>
        </div>
      </body>
    </html>
  );
}
