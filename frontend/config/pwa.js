import { VitePWA } from 'vite-plugin-pwa';

// Panel instalable (CLAUDE.md 3.3). El service worker guarda solo la app para
// abrir sin conexión; la API y las fotos van siempre a la red (otro origen: el
// service worker no las toca), así nunca se ve una caja o un pedido viejo.
export const pwa = () =>
  VitePWA({
    registerType: 'prompt',
    injectRegister: false, // lo registra src/shared/pwa/registrarPwa.js, solo en el panel
    // El manifest es public/manifest.webmanifest y lo enlaza registrarPwa.js solo
    // en el panel: así la vidriera, el sitio y el admin no ofrecen "Instalar".
    manifest: false,
    workbox: {
      // Sin el video ni las fotos de la landing: el celular del comercio baja lo justo.
      globPatterns: ['**/*.{js,css,html}', 'iconos/*.png', '*.svg', '**/*-latin-*.woff2'],
      navigateFallback: '/index.html',
      runtimeCaching: [],
    },
  });
