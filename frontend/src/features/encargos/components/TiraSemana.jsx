import css from './TiraSemana.module.css';

const iso = (d) => d.toLocaleDateString('sv-SE');

// Los 7 días desde `desde`, con un punto en los que tienen encargos.
export function TiraSemana({ desde, elegido, onElegir, conEncargos }) {
  const dias = Array.from(
    { length: 7 },
    (_, i) => new Date(desde.getFullYear(), desde.getMonth(), desde.getDate() + i),
  );
  return (
    <div className={css.tira} role="group" aria-label="Días de la semana">
      {dias.map((d) => {
        const clave = iso(d);
        const hay = conEncargos.has(clave);
        return (
          <button
            key={clave}
            type="button"
            className={css.dia}
            aria-pressed={clave === elegido}
            aria-label={`${d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric' })}${hay ? ', con encargos' : ''}`}
            onClick={() => onElegir(clave)}
          >
            <span className={css.nombre}>
              {d.toLocaleDateString('es-AR', { weekday: 'short' }).slice(0, 3)}
            </span>
            <span className={css.numero}>{d.getDate()}</span>
            <span className={hay ? css.punto : css.sinPunto} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
