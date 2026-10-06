import { Icono } from './Icono.jsx';
import css from './Cantidad.module.css';

// Selector − n + con botones de 44 px.
export function Cantidad({ valor, onCambio, min = 1, max = 99, nombre = 'producto' }) {
  return (
    <div className={css.cantidad} role="group" aria-label={`Cantidad de ${nombre}`}>
      <button
        type="button"
        className={css.boton}
        aria-label="Restar uno"
        disabled={valor <= min}
        onClick={() => onCambio(valor - 1)}
      >
        <Icono nombre="remove" tamano={20} />
      </button>
      <output className={css.valor} aria-live="polite">
        {valor}
      </output>
      <button
        type="button"
        className={css.boton}
        aria-label="Sumar uno"
        disabled={valor >= max}
        onClick={() => onCambio(valor + 1)}
      >
        <Icono nombre="add" tamano={20} />
      </button>
    </div>
  );
}
