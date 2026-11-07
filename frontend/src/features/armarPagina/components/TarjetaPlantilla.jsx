import { REGISTRO } from '../../pagina/bloques/registro.js';
import css from './TarjetaPlantilla.module.css';

const MAX_CHIPS = 5;

// Una plantilla para elegir: sus colores (los del estilo), para quién es y qué
// bloques trae, en orden.
export function TarjetaPlantilla({ p, tuya, onElegir }) {
  const nombres = [...new Set(p.bloques.map((b) => REGISTRO[b.tipo]?.nombre))];
  const resto = nombres.length - MAX_CHIPS;
  const c = p.colores;
  return (
    <button
      type="button"
      className={css.tarjeta}
      onClick={() => onElegir(p.clave)}
      aria-label={`Usar la plantilla ${p.nombre}`}
    >
      <span
        className={css.muestra}
        aria-hidden="true"
        data-vacia={c ? undefined : 'si'}
        style={c ? { '--m1': c.principal, '--m2': c.acento, '--m3': c.fondo } : undefined}
      />
      <span className={css.texto}>
        <strong className={css.nombre}>
          {p.nombre}
          {tuya ? <span className={css.tuya}>Tu estilo</span> : null}
        </strong>
        <span className={css.para}>{p.para}</span>
        <span className={css.bloques}>
          {nombres.slice(0, MAX_CHIPS).map((n) => (
            <span key={n} className={css.chip}>
              {n}
            </span>
          ))}
          {resto > 0 ? <span className={css.chip}>+{resto}</span> : null}
        </span>
      </span>
    </button>
  );
}
