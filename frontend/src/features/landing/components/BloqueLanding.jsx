import { useAparecer } from '../useAparecer.js';
import css from './BloqueLanding.module.css';

// Sección de la landing: cinta, título, bajada y contenido. Aparece al llegar con el scroll.
export function BloqueLanding({ cinta, titulo, bajada, centrado, fondo, id, children }) {
  const [ref, visible] = useAparecer();
  return (
    <section id={id} className={`${css.bloque} ${fondo ? css[fondo] : ''}`}>
      <div
        ref={ref}
        data-visible={visible}
        className={`${css.interior} ${centrado ? css.centrado : ''}`}
      >
        <div className={css.cabeza}>
          {cinta ? <p className={css.cinta}>{cinta}</p> : null}
          <h2 className={css.titulo}>{titulo}</h2>
          {bajada ? <p className={css.bajada}>{bajada}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
