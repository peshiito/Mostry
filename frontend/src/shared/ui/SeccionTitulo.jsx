import css from './SeccionTitulo.module.css';

// Título de sección (h2) con un link o acción a la derecha.
export function SeccionTitulo({ titulo, bajada, accion, id }) {
  return (
    <div className={css.fila}>
      <div>
        <h2 id={id} className={css.titulo}>
          {titulo}
        </h2>
        {bajada ? <p className={css.bajada}>{bajada}</p> : null}
      </div>
      {accion}
    </div>
  );
}
