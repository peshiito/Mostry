import { Cargando, Hueso } from './Hueso.jsx';
import css from './esqueletos.module.css';

// Detalle de una cosa (pedido, producto, comprobante): título, estado y bloques.
// `imagen`: una foto o comprobante grande arriba de los datos.
export function EsqueletoDetalle({ bloques = 3, imagen }) {
  return (
    <Cargando className={css.caja}>
      <Hueso ancho="35%" alto={12} />
      <Hueso ancho="65%" alto={28} />
      <div className={css.chips}>
        <Hueso ancho={96} alto={28} />
        <Hueso ancho={72} alto={28} />
      </div>
      {imagen ? <Hueso alto={220} /> : null}
      {Array.from({ length: bloques }, (_, i) => (
        <div key={i} className={`${css.tarjeta} ${css.numero}`}>
          <Hueso ancho="40%" alto={14} />
          <Hueso ancho="90%" />
          <Hueso ancho="70%" />
        </div>
      ))}
    </Cargando>
  );
}
