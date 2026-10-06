import { PALETAS } from '../../../shared/lib/paletas.js';
import css from './SelectorPaleta.module.css';

// Paletas cerradas (decisión 39): sin color libre, todas probadas en contraste.
export function SelectorPaleta({ valor, onCambio }) {
  return (
    <fieldset className={css.grupo}>
      <legend className={css.leyenda}>Colores de tu tienda</legend>
      <div className={css.grilla}>
        {Object.entries(PALETAS).map(([clave, p]) => (
          <label key={clave} className={css.opcion}>
            <input
              type="radio"
              name="paleta"
              value={clave}
              checked={valor === clave}
              onChange={() => onCambio(clave)}
            />
            <span className={css.muestra} aria-hidden="true">
              <span style={{ background: p.principal }} />
              <span style={{ background: p.acento }} />
            </span>
            {p.nombre}
          </label>
        ))}
      </div>
      <p className={css.nota}>Tu panel mantiene los colores de Mostry.</p>
    </fieldset>
  );
}
