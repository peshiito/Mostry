import { useSyncExternalStore } from 'react';

const CONSULTA = '(min-width: 1100px)';

// ¿Hay lugar para el editor de tres paneles (compu)? Si no, va en hojas (celu).
export function usePantallaGrande() {
  return useSyncExternalStore(
    (avisar) => {
      const m = window.matchMedia(CONSULTA);
      m.addEventListener('change', avisar);
      return () => m.removeEventListener('change', avisar);
    },
    () => window.matchMedia(CONSULTA).matches,
    () => false,
  );
}
