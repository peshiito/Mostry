import { plata } from '../lib/plata.js';
import { useContar } from '../movimiento/useContar.js';
import css from './Monto.module.css';

// Monto grande en Rubik con el "$" más chico y alineado arriba (cartel de precio).
// `animado`: cuenta hasta el valor (ventas del día, totales, saldos).
export function Monto({ centavos, tamano = 'lg', tono, tachado, animado }) {
  const visible = useContar(centavos, { activo: !!animado });
  const [, numero] = plata(visible).split(' ');
  const clases = [
    css.monto,
    css[tamano],
    tono ? css[tono] : '',
    tachado ? css.tachado : '',
  ];
  return (
    <span className={clases.join(' ')}>
      <span className={css.signo}>$</span>
      {numero}
    </span>
  );
}
