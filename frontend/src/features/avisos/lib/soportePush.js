// Avisos 1: en qué situación está este navegador para recibir avisos push.
const nav = () => (typeof navigator === 'undefined' ? {} : navigator);

export const esIphone = () => /iphone|ipad|ipod/i.test(nav().userAgent ?? '');

export const instalada = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || nav().standalone === true;

// Una compu (mouse) con el panel abierto en el navegador, no instalado.
export const esCompu = () =>
  window.matchMedia?.('(pointer: fine)').matches && !instalada();

// sin_soporte · ios_sin_instalar · bloqueado · disponible
export function situacion() {
  if (esIphone() && !instalada()) return 'ios_sin_instalar';
  if (
    !('serviceWorker' in nav()) ||
    !('PushManager' in window) ||
    !('Notification' in window)
  )
    return 'sin_soporte';
  if (Notification.permission === 'denied') return 'bloqueado';
  return 'disponible';
}

// La clave pública VAPID (base64url) como la pide pushManager.subscribe().
export function aBytes(base64url) {
  const relleno = '='.repeat((4 - (base64url.length % 4)) % 4);
  const base64 = (base64url + relleno).replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

// "Android · Chrome", para reconocer el teléfono (nada más del navegador).
export function nombreDispositivo(ua = nav().userAgent ?? '') {
  const so = /android/i.test(ua)
    ? 'Android'
    : /iphone|ipad/i.test(ua)
      ? 'iPhone'
      : /windows/i.test(ua)
        ? 'Windows'
        : /mac os/i.test(ua)
          ? 'Mac'
          : 'Otro';
  const nav2 = /edg\//i.test(ua)
    ? 'Edge'
    : /firefox/i.test(ua)
      ? 'Firefox'
      : /chrome/i.test(ua)
        ? 'Chrome'
        : /safari/i.test(ua)
          ? 'Safari'
          : 'Navegador';
  return `${so} · ${nav2}`;
}

// La suscripción de este navegador (null si no hay service worker o no se activó).
export async function suscripcionActual() {
  const reg = await nav().serviceWorker?.getRegistration?.('/');
  return reg ? reg.pushManager.getSubscription() : null;
}
