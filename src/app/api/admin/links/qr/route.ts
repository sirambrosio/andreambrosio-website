import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin-auth';
import QRCode from 'qrcode';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!(await getSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const slug = (new URL(req.url).searchParams.get('slug') || '').replace(/[^a-z0-9-]/gi, '');
  if (!slug) return NextResponse.json({ ok: false }, { status: 400 });
  const url = `https://track.andreambrosio.com/${slug}`;
  const png = await QRCode.toBuffer(url, { type: 'png', width: 600, margin: 2, color: { dark: '#151A1A', light: '#F0EBDF' } });
  return new NextResponse(new Uint8Array(png), { headers: { 'content-type': 'image/png', 'content-disposition': `attachment; filename="qr-${slug}.png"` } });
}
