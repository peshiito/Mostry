import { familiaCss } from '../../../shared/temaTienda/fuentes.js';
import { TEMAS } from '../../../shared/temaTienda/temas.js';
import css from './GaleriaTemas.module.css';

// Muestra de un estilo como una "carta de color": el nombre con su letra y sus
// colores. Cómo queda la tienda entera se ve arriba, en la vista previa.
function Carta({ t }) {
  const { principal, acento, fondo } = t.tema.colores;
  return (
    <span className={css.carta} style={{ background: fondo }} aria-hidden="true">
      <span
        className={css.nombre}
        style={{ color: principal, fontFamily: familiaCss(t.tema.fuentes.titulos) }}
      >
        {t.nombre}
      </span>
      <span className={css.colores}>
        {[principal, acento].map((c) => (
          <span key={c} className={css.punto} style={{ background: c }} />
        ))}
      </span>
    </span>
  );
}

// Los estilos armados: tocar uno lo aplica al borrador (colores, letras y forma).
export function GaleriaTemas({ actual, onElegir }) {
  return (
    <fieldset className={css.grupo}>
      <legend className={css.leyenda}>Elegí un estilo para arrancar</legend>
      <div className={css.grilla}>
        {TEMAS.map((t) => (
          <label key={t.clave} className={css.opcion}>
            <input
              type="radio"
              name="tema"
              checked={actual === t.clave}
              onChange={() => onElegir(t.tema)}
            />
            <Carta t={t} />
            <span className={css.titulo}>{t.nombre}</span>
            <span className={css.para}>{t.para}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
