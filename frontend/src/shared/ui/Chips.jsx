import { useId } from 'react';
import { conPastilla, PastillaActiva } from '../movimiento/PastillaActiva.jsx';
import css from './Chips.module.css';

// Filtros deslizables. opciones: [{ valor, texto, cuenta? }]
// El fondo del filtro elegido se desliza hasta el nuevo.
export function Chips({ opciones, valor, onCambio, etiqueta }) {
  const grupo = useId();
  return (
    <div className={css.fila} role="group" aria-label={etiqueta}>
      {opciones.map((o) => (
        <button
          key={o.valor}
          type="button"
          className={`${css.chip} ${conPastilla}`}
          aria-pressed={o.valor === valor}
          onClick={() => onCambio(o.valor)}
        >
          {o.valor === valor ? (
            <PastillaActiva grupo={grupo} className={css.pastilla} />
          ) : null}
          <span>{o.texto}</span>
          {o.cuenta != null ? <span className={css.cuenta}>{o.cuenta}</span> : null}
        </button>
      ))}
    </div>
  );
}
