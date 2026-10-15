import { Monto } from '../../../shared/ui/Monto.jsx';
import css from './Vender.module.css';

// Tocar un producto suma uno al ticket. Muestra cuántos van en la venta.
export function GrillaVender({ productos, lineas, onSumar }) {
  const cantidadDe = (id) => lineas.find((l) => l.producto.id === id)?.cantidad ?? 0;
  return (
    <ul className={css.grilla}>
      {productos.map((p) => {
        const n = cantidadDe(p.id);
        const agotado = p.modoStock === 'unidades' ? p.stockDisponible <= 0 : p.agotado;
        return (
          <li key={p.id}>
            <button
              type="button"
              className={`${css.producto} ${n ? css.elegido : ''}`}
              disabled={agotado}
              onClick={() => onSumar(p)}
              aria-label={`${p.nombre}${n ? `, ${n} en la venta` : ''}`}
            >
              <span className={css.nombre}>{p.nombre}</span>
              <Monto centavos={p.precio} tamano="sm" />
              {agotado ? <span className={css.marca}>No hay</span> : null}
              {n ? <span className={css.cuantos}>{n}</span> : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
