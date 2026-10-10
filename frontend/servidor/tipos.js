// Content-Type de cada extensión que genera el build.
export const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.vtt': 'text/vtt; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

// Lo que tiene hash en el nombre (assets/) no cambia nunca: se guarda un año.
// index.html, el service worker y el manifest se revisan siempre (versiones nuevas).
export const cacheDe = (ruta) =>
  ruta.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache';
