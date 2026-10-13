import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useState } from 'react';
import css from './NumeroQueRueda.module.css';

const variantes = {
  entra: (d) => ({ y: `${d * 70}%`, opacity: 0 }),
  quieto: { y: '0%', opacity: 1 },
  sale: (d) => ({ y: `${d * -70}%`, opacity: 0 }),
};

// Un número chico que "rueda": al sumar, el nuevo sube desde abajo; al restar,
// baja desde arriba (cantidades del carrito). El lector oye solo el valor.
export function NumeroQueRueda({ valor }) {
  const [paso, setPaso] = useState({ valor, dir: 0 });
  if (paso.valor !== valor) setPaso({ valor, dir: Math.sign(valor - paso.valor) });
  const dir = paso.valor === valor ? paso.dir : 0;
  return (
    <span className={css.marco}>
      <span className="soloLector">{valor}</span>
      <AnimatePresence initial={false} custom={dir} mode="popLayout">
        <m.span
          key={valor}
          custom={dir}
          variants={variantes}
          initial="entra"
          animate="quieto"
          exit="sale"
          transition={{ duration: 0.16 }}
          aria-hidden="true"
        >
          {valor}
        </m.span>
      </AnimatePresence>
    </span>
  );
}
