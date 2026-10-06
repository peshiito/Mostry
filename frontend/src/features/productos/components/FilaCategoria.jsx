import { plural } from '../../../shared/lib/texto.js';
import { BotonIcono } from '../../../shared/ui/BotonIcono.jsx';
import css from './FilaCategoria.module.css';

// Categoría con flechas para ordenar (accesible, sin arrastrar) y botón para quitarla.
export function FilaCategoria({ cat, primera, ultima, onSubir, onBajar, onQuitar }) {
  return (
    <li className={css.fila}>
      <div className={css.orden}>
        <BotonIcono
          icono="chevron_left"
          etiqueta={`Subir ${cat.nombre}`}
          disabled={primera}
          onClick={onSubir}
        />
        <BotonIcono
          icono="chevron_right"
          etiqueta={`Bajar ${cat.nombre}`}
          disabled={ultima}
          onClick={onBajar}
        />
      </div>
      <div className={css.textos}>
        <span className={css.nombre}>{cat.nombre}</span>
        <span className={css.cuenta}>
          {plural(cat.cantidad, 'producto', 'productos')}
        </span>
      </div>
      <BotonIcono icono="delete" etiqueta={`Quitar ${cat.nombre}`} onClick={onQuitar} />
    </li>
  );
}
