import css from './Chips.module.css';

// Filtros deslizables. opciones: [{ valor, texto, cuenta? }]
export function Chips({ opciones, valor, onCambio, etiqueta }) {
  return (
    <div className={css.fila} role="group" aria-label={etiqueta}>
      {opciones.map((o) => (
        <button
          key={o.valor}
          type="button"
          className={css.chip}
          aria-pressed={o.valor === valor}
          onClick={() => onCambio(o.valor)}
        >
          {o.texto}
          {o.cuenta != null ? <span className={css.cuenta}>{o.cuenta}</span> : null}
        </button>
      ))}
    </div>
  );
}
