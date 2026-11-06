import { Icono } from '../../../shared/ui/Icono.jsx';
import { NOMBRE_SECCION } from '../../tienda/lib/secciones.js';
import base from './Contenido.module.css';
import css from './EditorSecciones.module.css';

// Orden de las secciones del inicio: subir, bajar y mostrar u ocultar.
export function EditorSecciones({ secciones, onCambio }) {
  const mover = (i, paso) => {
    const otra = i + paso;
    if (otra < 0 || otra >= secciones.length) return;
    const nueva = [...secciones];
    [nueva[i], nueva[otra]] = [nueva[otra], nueva[i]];
    onCambio(nueva);
  };
  const alternar = (i) =>
    onCambio(secciones.map((s, j) => (j === i ? { ...s, visible: !s.visible } : s)));
  return (
    <fieldset className={base.grupo}>
      <legend className={base.leyenda}>Orden del inicio</legend>
      <ol className={css.secciones}>
        {secciones.map((s, i) => (
          <li key={s.id} className={s.visible ? undefined : css.oculta}>
            <label className={css.ver}>
              <input type="checkbox" checked={s.visible} onChange={() => alternar(i)} />
              {NOMBRE_SECCION[s.id]}
            </label>
            <button
              type="button"
              className={css.flecha}
              aria-label={`Subir ${NOMBRE_SECCION[s.id]}`}
              onClick={() => mover(i, -1)}
              disabled={i === 0}
            >
              <Icono nombre="chevron_left" tamano={20} />
            </button>
            <button
              type="button"
              className={`${css.flecha} ${css.abajo}`}
              aria-label={`Bajar ${NOMBRE_SECCION[s.id]}`}
              onClick={() => mover(i, 1)}
              disabled={i === secciones.length - 1}
            >
              <Icono nombre="chevron_left" tamano={20} />
            </button>
          </li>
        ))}
      </ol>
    </fieldset>
  );
}
