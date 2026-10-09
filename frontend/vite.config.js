import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';
import { pwa } from './config/pwa.js';
import { temaEnLinea } from './config/temaEnLinea.js';
import { encabezados } from './encabezados.config.js';

// Los íconos SVG se importan como componentes con el sufijo ?react.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const origenes = { api: env.VITE_API_URL, archivos: env.VITE_ORIGEN_ARCHIVOS };
  return {
    plugins: [
      react(),
      temaEnLinea(),
      pwa(),
      svgr({
        svgrOptions: { svgProps: { fill: 'currentColor', 'aria-hidden': 'true' } },
      }),
    ],
    // Todo lo de src/shared en un solo archivo: menos pedidos chicos encadenados.
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: { groups: [{ name: 'compartido', test: /\/src\/shared\// }] },
        },
      },
    },
    server: {
      port: 5173,
      allowedHosts: ['.localhost'],
      headers: encabezados({ ...origenes, dev: true }),
    },
    // `vite preview` sirve el build como en producción: CSP estricta.
    preview: {
      allowedHosts: ['.localhost'],
      headers: encabezados({ ...origenes, dev: false }),
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.js'],
      css: { modules: { classNameStrategy: 'non-scoped' } },
    },
  };
});
