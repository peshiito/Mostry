import { useId } from 'react';
import area from './AreaTexto.module.css';
import css from './Campo.module.css';

// Etiqueta visible + ayuda + error junto al campo (nunca solo placeholder).
// `children` recibe { id, describedBy, invalido } para conectar el control.
export function Campo({ etiqueta, ayuda, error, extra, children }) {
  const id = useId();
  const idAyuda = `${id}-ayuda`;
  const idError = `${id}-error`;
  const describedBy = [ayuda ? idAyuda : '', error ? idError : ''].join(' ').trim();
  return (
    <div className={css.campo}>
      <div className={css.cabeza}>
        <label htmlFor={id} className={css.etiqueta}>
          {etiqueta}
        </label>
        {extra}
      </div>
      {children({ id, describedBy: describedBy || undefined, invalido: !!error })}
      {ayuda && !error ? (
        <p id={idAyuda} className={css.ayuda}>
          {ayuda}
        </p>
      ) : null}
      {error ? (
        <p id={idError} className={css.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Entrada({ c, prefijo, sufijo, className = '', ...props }) {
  return (
    <div className={`${css.caja} ${c.invalido ? css.invalida : ''}`}>
      {prefijo ? <span className={css.afijo}>{prefijo}</span> : null}
      <input
        id={c.id}
        aria-describedby={c.describedBy}
        aria-invalid={c.invalido || undefined}
        {...props}
        className={`${css.input} ${className}`}
      />
      {sufijo ? <span className={`${css.afijo} ${css.sufijo}`}>{sufijo}</span> : null}
    </div>
  );
}

export function AreaTexto({ c, ...props }) {
  return (
    <textarea
      id={c.id}
      aria-describedby={c.describedBy}
      aria-invalid={c.invalido || undefined}
      className={`${area.area} ${c.invalido ? area.invalida : ''}`}
      rows={3}
      {...props}
    />
  );
}
