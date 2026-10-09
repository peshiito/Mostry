// Pone el modo claro u oscuro ANTES de que cargue la app (sin destello blanco).
// Vite lo mete en línea en el <head> (config/temaEnLinea.js) y la CSP lo
// autoriza por su hash: no es un pedido más que frene el primer dibujo.
// La lógica completa (y los cambios en vivo) vive en src/shared/tema/tema.js.
(function () {
  var preferencia = 'sistema';
  try {
    preferencia = localStorage.getItem('mostry:tema') || 'sistema';
  } catch {
    /* sin almacenamiento: seguimos al sistema */
  }
  var oscuro =
    preferencia === 'oscuro' ||
    (preferencia === 'sistema' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.tema = oscuro ? 'oscuro' : 'claro';
  // La barra del navegador del celular, del mismo color que la pantalla.
  var barra = document.querySelector('meta[name="theme-color"]');
  if (barra) barra.setAttribute('content', oscuro ? '#0F1714' : '#0E5A4A');
})();
