import { plural } from '../../../shared/lib/texto.js';
import { Monto } from '../../../shared/ui/Monto.jsx';
import { Tarjeta } from '../../../shared/ui/Tarjeta.jsx';
import css from './TarjetaVentas.module.css';

export function TarjetaVentas({ ventas, pedidos }) {
  return (
    <Tarjeta className={css.tarjeta}>
      <span className={css.etiqueta}>Ventas de hoy</span>
      <Monto centavos={ventas} tamano="xl" />
      <span className={css.detalle}>{plural(pedidos, 'pedido', 'pedidos')}</span>
    </Tarjeta>
  );
}
