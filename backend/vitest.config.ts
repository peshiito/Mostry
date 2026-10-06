import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    setupFiles: ['src/test/setup.ts'],
    globalSetup: ['src/test/globalSetup.ts'],
    // Comparten la base mostry_test: un archivo por vez.
    fileParallelism: false,
    // Tests contra MySQL y RustFS reales: 5 s por defecto queda justo con la máquina cargada.
    testTimeout: 15_000,
    hookTimeout: 30_000,
    environment: 'node',
  },
});
