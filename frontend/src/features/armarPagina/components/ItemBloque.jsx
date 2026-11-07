import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BotonIcono } from '../../../shared/ui/BotonIcono.jsx';
import { Icono } from '../../../shared/ui/Icono.jsx';
import { REGISTRO } from '../../pagina/bloques/registro.js';
import { resumenBloque } from '../lib/resumen.js';
import css from './ItemBloque.module.css';
import lista from './ListaBloques.module.css';

// Un bloque en la lista: se arrastra por la manija, se toca para editarlo, se
// puede ocultar sin borrarlo o sacar (con "Deshacer" en el aviso).
export function ItemBloque({ bloque, elegido, onEditar, onAlternar, onQuitar }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: bloque.id });
  const info = REGISTRO[bloque.tipo];
  const estilo = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <li
      ref={setNodeRef}
      style={estilo}
      className={lista.item}
      data-arrastrando={isDragging || undefined}
      data-elegido={elegido || undefined}
      data-oculto={!bloque.visible || undefined}
    >
      <button
        type="button"
        className={css.manija}
        aria-label={`Mover ${info.nombre}`}
        {...attributes}
        {...listeners}
      >
        <Icono nombre="drag_indicator" tamano={22} />
      </button>
      <button type="button" className={css.cuerpo} onClick={() => onEditar(bloque.id)}>
        <span className={css.icono}>
          <Icono nombre={info.icono} tamano={20} />
        </span>
        <span className={css.textos}>
          <span className={css.nombre}>{info.nombre}</span>
          <span className={css.resumen}>{resumenBloque(bloque)}</span>
        </span>
      </button>
      <BotonIcono
        icono={bloque.visible ? 'visibility' : 'visibility_off'}
        etiqueta={bloque.visible ? `Ocultar ${info.nombre}` : `Mostrar ${info.nombre}`}
        onClick={() => onAlternar(bloque.id)}
      />
      <BotonIcono
        icono="delete"
        etiqueta={`Sacar ${info.nombre}`}
        onClick={() => onQuitar(bloque.id)}
      />
    </li>
  );
}
