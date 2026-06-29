export type ToastKind = 'success' | 'error' | 'info';
/** Toast global do painel — ouvido pelo <ToastHost/> montado na Shell. */
export function toast(message: string, kind: ToastKind = 'info') {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('aa:toast', { detail: { message, kind } }));
}
