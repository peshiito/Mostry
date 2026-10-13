import { useId } from 'react';
import { conPastilla, PastillaActiva } from '../movimiento/PastillaActiva.jsx';
import css from './Segmentado.module.css';

// Control segmentado (radio group). opciones: [{ valor, texto }]
// El fondo de la opción elegida se desliza hasta la nueva.
export function Segmentado({ opciones, valor, onCambio, etiqueta }) {
  const grupo = useId();
  return (
    <div className={css.grupo} role="radiogroup" aria-label={etiqueta}>
      {opciones.map((o) => (
        <button
          key={o.valor}
          type="button"
          role="radio"
          aria-checked={o.valor === valor}
          className={`${css.opcion} ${conPastilla}`}
          onClick={() => onCambio(o.valor)}
        >
          {o.valor === valor ? (
            <PastillaActiva grupo={grupo} className={css.pastilla} />
          ) : null}
          <span>{o.texto}</span>
        </button>
      ))}
    </div>
  );
}
