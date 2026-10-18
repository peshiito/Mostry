import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Sin `globals` de Vitest, Testing Library no desmonta solo: sin esto, React
// sigue renderizando después de cada test y, en una máquina lenta (el CI),
// termina cuando el entorno ya no existe ("window is not defined").
afterEach(() => {
  cleanup();
});
