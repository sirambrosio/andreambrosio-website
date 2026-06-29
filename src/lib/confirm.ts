export function confirmModal(message: string): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  return new Promise((resolve) => {
    window.dispatchEvent(new CustomEvent('aa:confirm', { detail: { message, resolve } }));
  });
}
