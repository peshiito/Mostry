import { REGISTRO } from '../../pagina/bloques/registro.js';

// Lo que escucha quien usa lector de pantalla al reordenar (en castellano).
export function accesibilidadArrastre(bloques) {
  const nombre = (id) =>
    REGISTRO[bloques.find((b) => b.id === id)?.tipo]?.nombre ?? 'Bloque';
  const lugar = (id) => bloques.findIndex((b) => b.id === id) + 1;
  return {
    screenReaderInstructions: {
      draggable:
        'Para mover un bloque, apretá espacio o enter. Movelo con las flechas y apretá espacio de nuevo para soltarlo. Escape cancela.',
    },
    announcements: {
      onDragStart: ({ active }) => `Agarraste ${nombre(active.id)}.`,
      onDragOver: ({ active, over }) =>
        over ? `${nombre(active.id)} va al lugar ${lugar(over.id)}.` : undefined,
      onDragEnd: ({ active, over }) =>
        over ? `Soltaste ${nombre(active.id)} en el lugar ${lugar(over.id)}.` : undefined,
      onDragCancel: ({ active }) =>
        `Cancelaste. ${nombre(active.id)} quedó donde estaba.`,
    },
  };
}
