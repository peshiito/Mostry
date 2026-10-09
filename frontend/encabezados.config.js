// Encabezados de seguridad del frontend (sección 7): los mismos que tiene que
// mandar el servidor de producción (Etapa 16). `dev` afloja solo lo que necesita
// Vite en desarrollo (script en línea de React Refresh y el websocket de HMR).
import { HASH_TEMA } from './config/temaEnLinea.js';

export function encabezados({ api, archivos, dev }) {
  const csp = [
    "default-src 'self'",
    // En el build solo se permite el script del tema en línea, por su hash.
    `script-src 'self' ${dev ? "'unsafe-inline'" : HASH_TEMA}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: ${archivos}`,
    "font-src 'self'",
    "worker-src 'self'",
    "media-src 'self'",
    `connect-src 'self' ${api}${dev ? ' ws: wss:' : ''}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
  return {
    'Content-Security-Policy': csp,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
  };
}
