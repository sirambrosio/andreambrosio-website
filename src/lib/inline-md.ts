/** Markdown inline mínimo (bold/italic/code) → HTML escapado. Conteúdo próprio, não user-generated. */
export function inlineMd(raw: string): string {
  const esc = raw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-text">$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="font-mono text-[0.9em] text-champagne">$1</code>');
}
