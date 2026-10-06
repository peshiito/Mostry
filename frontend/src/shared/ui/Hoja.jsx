import { useEffect, useId, useRef } from 'react';
import { BotonIcono } from './BotonIcono.jsx';
import css from './Hoja.module.css';
import mov from './HojaMovimiento.module.css';

// Hoja inferior modal (en escritorio se ve como diálogo centrado).
// Usa <dialog> nativo: atrapa el foco y cierra con Escape.
export function Hoja({ abierta, onCerrar, titulo, subtitulo, children, ancha }) {
  const ref = useRef(null);
  const idTitulo = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierta && !d.open) d.showModal?.();
    if (!abierta && d.open) d.close();
  }, [abierta]);
  return (
    <dialog
      ref={ref}
      className={`${css.hoja} ${mov.hoja} ${ancha ? css.ancha : ''}`}
      onClose={onCerrar}
      onClick={(e) => e.target === ref.current && onCerrar()}
      aria-labelledby={idTitulo}
    >
      <div className={css.contenido}>
        <span className={css.agarre} aria-hidden="true" />
        <header className={css.cabeza}>
          <div>
            <h2 id={idTitulo} className={css.titulo}>
              {titulo}
            </h2>
            {subtitulo ? <p className={css.subtitulo}>{subtitulo}</p> : null}
          </div>
          <BotonIcono icono="close" etiqueta="Cerrar" onClick={onCerrar} />
        </header>
        {children}
      </div>
    </dialog>
  );
}
