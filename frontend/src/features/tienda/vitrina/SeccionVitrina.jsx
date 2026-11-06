import { Link } from 'react-router';
import css from './SeccionVitrina.module.css';

// Una sección de la vidriera con su título (cada estilo le da su forma).
export function SeccionVitrina({ id, titulo, bajada, ver, children }) {
  return (
    <section aria-labelledby={id} className={css.seccion} data-v="seccion">
      <div className={css.cabeza}>
        <div>
          <h2 id={id} className={css.titulo} data-v="titulo">
            {titulo}
          </h2>
          {bajada ? <p className={css.bajada}>{bajada}</p> : null}
        </div>
        {ver ? (
          <Link to={ver} className={css.ver} data-v="ver">
            Ver todo
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
