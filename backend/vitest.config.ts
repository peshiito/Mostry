import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    setupFiles: ['src/test/setup.ts'],
    globalSetup: ['src/test/globalSetup.ts'],
    // Comparten la base mostry_test: un archivo por vez.
    fileParallelism: false,
    environment: 'node',
  },
});
