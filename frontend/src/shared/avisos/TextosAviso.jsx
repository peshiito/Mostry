import { cerrarAviso } from './avisos.js';
import p from './PartesAviso.module.css';
import css from './TextosAviso.module.css';

// Título, detalle y, si hay, un botón de acción ("Actualizar") que cierra el aviso.
export function TextosAviso({ aviso }) {
  const { id, titulo, descripcion, accion } = aviso;
  return (
    <div className={p.textos}>
      <p className={p.titulo}>{titulo}</p>
      {descripcion ? <p className={p.descripcion}>{descripcion}</p> : null}
      {accion ? (
        <button
          type="button"
          className={css.accion}
          onClick={() => {
            cerrarAviso(id);
            accion.alHacer();
          }}
        >
          {accion.texto}
        </button>
      ) : null}
    </div>
  );
}
