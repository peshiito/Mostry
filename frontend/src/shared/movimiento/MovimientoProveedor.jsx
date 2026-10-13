import { LazyMotion, MotionConfig } from 'motion/react';
import { RESORTES } from './resortes.js';

// Si no se pueden bajar (sin internet, versión vieja), la app sigue sin
// animaciones: utilidades.css muestra lo que quedó en su estado inicial.
const cargar = () =>
  import('../../movimientoDiferido/caracteristicas.js')
    .then((m) => m.default)
    .catch(() => {
      document.documentElement.dataset.sinMovimiento = '';
      return {};
    });

// Envuelve toda la app: Motion liviano (componentes `m`, funciones que se bajan
// aparte) y, si la persona pidió "reducir movimiento", sin desplazamientos.
export function MovimientoProveedor({ children }) {
  return (
    <LazyMotion features={cargar} strict>
      <MotionConfig reducedMotion="user" transition={RESORTES.rapido}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
