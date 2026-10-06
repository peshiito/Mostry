import css from './BloqueLanding.module.css';

// Sección de la landing: cinta, título, bajada y contenido.
export function BloqueLanding({ cinta, titulo, bajada, centrado, fondo, children }) {
  return (
    <section className={`${css.bloque} ${fondo ? css[fondo] : ''}`}>
      <div className={`${css.interior} ${centrado ? css.centrado : ''}`}>
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
