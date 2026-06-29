import { toast } from './toast';
/** Fetch unificado do painel: parseia JSON, trata rede e dispara toast de erro. */
export async function api<T = unknown>(
  url: string,
  opts?: RequestInit & { errorMsg?: string; silent?: boolean },
): Promise<{ ok: boolean; status: number; data: T | null }> {
  try {
    const r = await fetch(url, opts);
    const data = (await r.json().catch(() => null)) as T | null;
    if (!r.ok && !opts?.silent) {
      toast(opts?.errorMsg || (r.status === 401 ? 'Sessão expirada — faça login de novo.' : 'Algo deu errado.'), 'error');
    }
    return { ok: r.ok, status: r.status, data };
  } catch {
    if (!opts?.silent) toast('Sem conexão com o servidor.', 'error');
    return { ok: false, status: 0, data: null };
  }
}
