import * as m from 'motion/react-m';
import { RESORTES } from '../../shared/movimiento/resortes.js';
import css from './NavPanel.module.css';

// Cuántos pedidos esperan aprobación: aparece con un pop y late al cambiar.
export function Insignia({ n }) {
  return (
    <m.span
      key={n}
      className={css.insignia}
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={RESORTES.festejo}
      aria-label={`${n} por aprobar`}
    >
      {n}
    </m.span>
  );
}
