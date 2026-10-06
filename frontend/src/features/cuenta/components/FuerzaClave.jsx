import { nivelClave, TEXTO_NIVEL } from '../lib/clave.js';
import css from './FuerzaClave.module.css';

export function FuerzaClave({ clave }) {
  const nivel = nivelClave(clave);
  return (
    <div className={css.fuerza}>
      <div className={css.barras} aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={`${css.barra} ${n <= nivel ? css[`n${nivel}`] : ''}`}
          />
        ))}
      </div>
      <span className={css.texto} aria-live="polite">
        {TEXTO_NIVEL[nivel]}
      </span>
    </div>
  );
}
