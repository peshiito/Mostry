import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// Los íconos SVG se importan como componentes con el sufijo ?react.
export default defineConfig({
  plugins: [
    react(),
    svgr({ svgrOptions: { svgProps: { fill: 'currentColor', 'aria-hidden': 'true' } } }),
  ],
  server: { port: 5173, allowedHosts: ['.localhost'] },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
  },
});
