import { defineConfig } from '@playwright/test';
import base from './playwright.config.js';

// Capturas de los estados de carga y error para revisarlos a ojo (Mejoras 1).
// No es parte de la suite: npx playwright test -c capturas.config.js
export default defineConfig({
  ...base,
  testMatch: /(capturas\/.*\.capturas|sesiones\.setup)\.js$/,
  reporter: 'line',
  projects: [
    { name: 'sesiones', testMatch: /sesiones\.setup\.js$/ },
    {
      name: 'capturas',
      testMatch: /capturas\/.*\.capturas\.js$/,
      dependencies: ['sesiones'],
    },
  ],
});
