import { PREGUNTAS } from '../preguntas.js';
import css from './Preguntas.module.css';

// Preguntas frecuentes desplegables (details/summary nativo, accesible).
export function Preguntas() {
  return (
    <div className={css.grilla}>
      {PREGUNTAS.map(([p, r]) => (
        <details key={p} className={css.pregunta}>
          <summary className={css.resumen}>{p}</summary>
          <p className={css.respuesta}>{r}</p>
        </details>
      ))}
    </div>
  );
}
