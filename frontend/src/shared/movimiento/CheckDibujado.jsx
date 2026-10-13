import * as m from 'motion/react-m';
import { EASE_OUT, RESORTES } from './resortes.js';

// Un ✓ que se dibuja: el círculo aparece con un rebote y el trazo se pinta
// de punta a punta. Para confirmar que algo salió bien (avisos, pantallas
// de "listo"). Toma el color del texto (currentColor).
export function CheckDibujado({ tamano = 24 }) {
  return (
    <m.svg
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={RESORTES.festejo}
    >
      <circle cx="12" cy="12" r="9.5" opacity={0.35} />
      <m.path
        d="M7.5 12.5l3 3 6-6.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.32, ease: EASE_OUT, delay: 0.12 }}
      />
    </m.svg>
  );
}
