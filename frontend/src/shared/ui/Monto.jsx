import { plata } from '../lib/plata.js';
import css from './Monto.module.css';

// Monto grande en Rubik con el "$" más chico y alineado arriba (cartel de precio).
export function Monto({ centavos, tamano = 'lg', tono, tachado }) {
  const [, numero] = plata(centavos).split(' ');
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
