import css from './Local.module.css';
import estado from './LocalEstado.module.css';

// Un local de la cuadra: toldo a rayas con el color de la tienda, cartel y vidriera.
// Es una pestaña: al elegirlo, el celular muestra su tienda.
export function Local({ local, elegido, onElegir, ref }) {
  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      id={`local-${local.id}`}
      aria-selected={elegido}
      aria-controls="vidriera-local"
      tabIndex={elegido ? 0 : -1}
      className={`${css.local} ${estado.estado}`}
      style={{ '--c-base': local.color, '--a': local.acento }}
      onClick={onElegir}
    >
      <span className={css.toldo} aria-hidden="true" />
      <span className={css.fachada}>
        <span className={css.cartel}>{local.nombre}</span>
        <span className={css.vidriera} aria-hidden="true" />
      </span>
      <span className={css.rubro}>{local.rubro}</span>
    </button>
  );
}
