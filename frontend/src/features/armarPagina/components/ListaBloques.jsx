import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { accesibilidadArrastre } from '../lib/anuncios.js';
import { quitar } from '../lib/quitar.js';
import { ItemBloque } from './ItemBloque.jsx';
import css from './ListaBloques.module.css';

// Los bloques de la página en orden. Se reordenan arrastrando (dedo, mouse o
// teclado: espacio para agarrar, flechas para mover, espacio para soltar).
export function ListaBloques({ bloques, elegido, despachar, onEditar }) {
  const sensores = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const indice = (id) => bloques.findIndex((b) => b.id === id);
  function soltar({ active, over }) {
    if (over)
      despachar({ tipo: 'mover', desde: indice(active.id), hasta: indice(over.id) });
  }
  return (
    <DndContext
      sensors={sensores}
      collisionDetection={closestCenter}
      onDragEnd={soltar}
      accessibility={accesibilidadArrastre(bloques)}
    >
      <SortableContext
        items={bloques.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <ol className={css.lista} aria-label="Bloques de tu página">
          {bloques.map((b) => (
            <ItemBloque
              key={b.id}
              bloque={b}
              elegido={b.id === elegido}
              onEditar={onEditar}
              onAlternar={(id) => despachar({ tipo: 'alternar', id })}
              onQuitar={(id) => quitar(id, despachar, bloques)}
            />
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  );
}
