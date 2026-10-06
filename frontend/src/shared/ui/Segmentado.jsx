import css from './Segmentado.module.css';

// Control segmentado (radio group). opciones: [{ valor, texto }]
export function Segmentado({ opciones, valor, onCambio, etiqueta }) {
  return (
    <div className={css.grupo} role="radiogroup" aria-label={etiqueta}>
      {opciones.map((o) => (
        <button
          key={o.valor}
          type="button"
          role="radio"
          aria-checked={o.valor === valor}
          className={css.opcion}
          onClick={() => onCambio(o.valor)}
        >
          {o.texto}
        </button>
      ))}
    </div>
  );
}
