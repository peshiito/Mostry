import { TEMAS } from '../../../shared/temaTienda/temas.js';
import { MuestraTema } from './MuestraTema.jsx';
import css from './GaleriaTemas.module.css';

// Los temas armados: tocar uno lo aplica al borrador (colores, letras y forma).
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
            <MuestraTema tema={t.tema} nombre={t.nombre} chica />
            <span className={css.para}>{t.para}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
