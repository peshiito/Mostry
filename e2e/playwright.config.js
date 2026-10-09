import { defineConfig } from '@playwright/test';
import { ENV_API, PUERTO_API, PUERTO_PWA, PUERTO_WEB } from './apoyo/entorno.js';

// Recorridos completos en un navegador real (Etapa 13). Levanta su propia API
// (puerto 3100, base mostry_e2e) y su propio frontend (5273): no toca los de desarrollo.
export default defineConfig({
  testDir: '.',
  testMatch: /(pruebas\/.*\.spec|sesiones\.setup)\.js$/,
  workers: 1, // los recorridos comparten la base: van de a uno
  timeout: 60_000,
  expect: { timeout: 10_000 },
  globalSetup: './apoyo/preparar.js',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    viewport: { width: 390, height: 844 }, // mobile first
    locale: 'es-AR',
    timezoneId: 'America/Argentina/Buenos_Aires',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'sesiones', testMatch: /sesiones\.setup\.js$/ },
    {
      name: 'recorridos',
      testMatch: /pruebas\/.*\.spec\.js$/,
      dependencies: ['sesiones'],
    },
  ],
  webServer: [
    {
      command: 'npx tsx --env-file=../.env src/server.ts',
      cwd: '../backend',
      url: `http://localhost:${PUERTO_API}/health`,
      env: { ...process.env, ...ENV_API },
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      command: `npx vite --port ${PUERTO_WEB} --strictPort`,
      cwd: '../frontend',
      url: `http://localhost:${PUERTO_WEB}`,
      env: {
        ...process.env,
        VITE_API_URL: `http://api.mostry.localhost:${PUERTO_API}`,
      },
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      // Build de producción servido con su CSP real, para probar la app instalable.
      command: `npx vite build --outDir dist-e2e --emptyOutDir && npx vite preview --outDir dist-e2e --port ${PUERTO_PWA} --strictPort`,
      cwd: '../frontend',
      url: `http://localhost:${PUERTO_PWA}`,
      env: { ...process.env, VITE_API_URL: `http://api.mostry.localhost:${PUERTO_API}` },
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
