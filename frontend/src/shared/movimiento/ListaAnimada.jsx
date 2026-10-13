import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { createContext, useContext } from 'react';
import { EASE_OUT } from './resortes.js';

const TOPE = 8; // después del octavo, los ítems llegan juntos (no se hace largo)
const Reacomodar = createContext(false);

const variantes = {
  oculto: { opacity: 0, y: 8 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: EASE_OUT, delay: Math.min(i, TOPE) * 0.03 },
  }),
  saliendo: { opacity: 0, scale: 0.97, transition: { duration: 0.15 } },
};

// Lista cuyos ítems entran escalonados. Con `reacomodar` (listas que cambian de a
// un ítem: aprobar un pedido, borrar una nota), el que se va se desvanece y los
// demás se deslizan a su lugar. Las listas que se filtran o se buscan no lo usan:
// se les cambia la `key` y entran de nuevo, sin superponerse.
export function ListaAnimada({ as: Tag = 'ul', className = '', reacomodar, children }) {
  // En una tabla las filas no pueden "despegarse": sin popLayout.
  const modo = Tag === 'tbody' ? 'sync' : 'popLayout';
  return (
    <Tag className={className} style={{ position: 'relative' }}>
      <Reacomodar.Provider value={!!reacomodar}>
        {reacomodar ? (
          <AnimatePresence mode={modo}>{children}</AnimatePresence>
        ) : (
          children
        )}
      </Reacomodar.Provider>
    </Tag>
  );
}

const ETIQUETAS = { li: m.li, div: m.div, tr: m.tr };

// Un ítem de ListaAnimada (`li`, `div` en una Lista o `tr`). `i` = posición.
export function ItemAnimado({ as = 'li', i, children, ...resto }) {
  const Tag = ETIQUETAS[as];
  const reacomodar = useContext(Reacomodar);
  return (
    <Tag
      layout={reacomodar ? 'position' : undefined}
      variants={variantes}
      custom={i}
      initial="oculto"
      animate="visible"
      exit="saliendo"
      {...resto}
    >
      {children}
    </Tag>
  );
}
