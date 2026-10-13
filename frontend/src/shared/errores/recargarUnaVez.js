// Cuando sale una versión nueva de Mostry, los archivos viejos de las pantallas
// dejan de existir y bajar una pantalla falla. Recargar trae la versión nueva,
// pero una sola vez: si vuelve a fallar enseguida, es otra cosa y se muestra.
const CLAVE = 'mostry:recarga-por-version';
const VENTANA_MS = 30_000;

const MENSAJES = [
  'dynamically imported module',
  'Importing a module script failed',
  'error loading dynamically imported module',
  'Unable to preload CSS',
];

export const esErrorDeCarga = (error) =>
  error?.name === 'ChunkLoadError' ||
  MENSAJES.some((m) => String(error?.message ?? '').includes(m));

export function recargarUnaVez() {
  try {
    const ultima = Number(sessionStorage.getItem(CLAVE)) || 0;
    if (Date.now() - ultima < VENTANA_MS) return false;
    sessionStorage.setItem(CLAVE, String(Date.now()));
  } catch {
    return false; // sin almacenamiento no se puede evitar un bucle: no recarga
  }
  window.location.reload();
  return true;
}

// Vite avisa con este evento cuando no puede bajar una pantalla.
export function escucharVersionNueva() {
  window.addEventListener('vite:preloadError', (e) => {
    if (recargarUnaVez()) e.preventDefault();
  });
}
