import * as m from 'motion/react-m';
import { RESORTES } from './resortes.js';
import css from './PastillaActiva.module.css';

// Fondo de la opción elegida que se desliza de una a otra (pestañas, chips,
// menú). `grupo` tiene que ser único por barra: es el layoutId de Motion.
// El contenedor necesita la clase `conPastilla` (posición y capa propia).
export function PastillaActiva({ grupo, className = '' }) {
  return (
    <m.span
      layoutId={grupo}
      className={`${css.pastilla} ${className}`}
      transition={RESORTES.rapido}
      aria-hidden="true"
    />
  );
}

export const conPastilla = css.conPastilla;
