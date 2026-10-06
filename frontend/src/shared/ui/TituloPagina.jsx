import css from './TituloPagina.module.css';

// Encabezado de pantalla: migas opcionales, h1, bajada y una acción a la derecha.
export function TituloPagina({ titulo, bajada, migas, accion, etiqueta }) {
  return (
    <header className={css.cabeza}>
      {migas ? <p className={css.migas}>{migas}</p> : null}
      <div className={css.fila}>
        <h1 className={css.titulo}>{titulo}</h1>
        {etiqueta}
        {accion ? <div className={css.accion}>{accion}</div> : null}
      </div>
      {bajada ? <p className={css.bajada}>{bajada}</p> : null}
    </header>
  );
}
