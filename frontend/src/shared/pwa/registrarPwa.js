import { avisar } from '../avisos/avisos.js';

// Registra el service worker que deja instalar el panel y abrirlo sin conexión.
// Solo guarda la app (JS, CSS, íconos); los datos siempre vienen en vivo de la API.
// Si hay una versión nueva no recarga sola (cortaría una carga a medias): avisa.
let registrado = false;

// `manifest`: el del panel o el del Club (cada uno se instala como su propia app).
export async function registrarPwa(manifest = '/manifest.webmanifest') {
  if (registrado || !import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  registrado = true;
  const enlace = Object.assign(document.createElement('link'), {
    rel: 'manifest',
    href: manifest,
  });
  document.head.append(enlace);
  const { registerSW } = await import('virtual:pwa-register');
  const actualizar = registerSW({
    onNeedRefresh: () =>
      avisar.info('Hay una versión nueva de Mostry', {
        duracion: Infinity,
        accion: { texto: 'Actualizar', alHacer: () => actualizar(true) },
      }),
  });
}
