import { EASE_OUT, RESORTES } from './resortes.js';

// Entra desde un poco más abajo y transparente (nunca desde scale 0).
export const aparecer = {
  oculto: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: EASE_OUT } },
  saliendo: { opacity: 0, scale: 0.97, transition: { duration: 0.15 } },
};

// Un "pop" corto para íconos, insignias y logros.
export const pop = {
  oculto: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: RESORTES.festejo },
};

// Hijos que llegan uno detrás de otro (`ms` entre cada uno).
export const escalonar = (ms = 30) => ({
  oculto: {},
  visible: { transition: { staggerChildren: ms / 1000 } },
});
