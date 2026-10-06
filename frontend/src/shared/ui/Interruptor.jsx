import css from './Interruptor.module.css';

// Switch accesible (role="switch"). La etiqueta siempre es visible.
export function Interruptor({ etiqueta, ayuda, activo, onCambio, oculto }) {
  return (
    <label className={css.fila}>
      <span className={oculto ? 'soloLector' : css.textos}>
        <span className={css.etiqueta}>{etiqueta}</span>
        {ayuda ? <span className={css.ayuda}>{ayuda}</span> : null}
      </span>
      <input
        type="checkbox"
        role="switch"
        className={css.input}
        checked={activo}
        onChange={(e) => onCambio?.(e.target.checked)}
      />
      <span className={css.pista} aria-hidden="true" />
    </label>
  );
}
