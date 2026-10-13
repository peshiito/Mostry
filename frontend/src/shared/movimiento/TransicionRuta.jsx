import * as m from 'motion/react-m';
import { useState } from 'react';
import { useLocation, useOutlet } from 'react-router';
import { EASE_OUT } from './resortes.js';

const DESPLAZAMIENTO = 12; // px: se nota la dirección sin "viajar"

// Posición de una ruta en la barra de pestañas (la más larga que coincida).
const lugar = (ruta, orden) =>
  orden.reduce((mejor, o, i) => (ruta === o || ruta.startsWith(`${o}/`) ? i : mejor), -1);

// La pantalla nueva entra con un fundido corto, desde el lado hacia el que
// "fuiste" según el orden de las pestañas (`orden`). Sin salida animada: la
// pantalla anterior se va al instante, así nada espera a una animación.
export function TransicionRuta({ orden = [], soloFundido }) {
  const { pathname } = useLocation();
  const outlet = useOutlet();
  // La dirección se calcula una vez por cambio de ruta (estado derivado).
  const [paso, setPaso] = useState({ ruta: pathname, lado: 0, primera: true });
  if (paso.ruta !== pathname) {
    const antes = lugar(paso.ruta, orden);
    const ahora = lugar(pathname, orden);
    const ok = antes >= 0 && ahora >= 0 && antes !== ahora;
    setPaso({ ruta: pathname, lado: ok ? Math.sign(ahora - antes) : 0, primera: false });
  }
  const lado = paso.ruta === pathname ? paso.lado : 0;
  // Con barras fijas adentro (tienda), sin transform: no las corre de lugar.
  const desde = soloFundido
    ? { opacity: 0 }
    : { opacity: 0, x: lado * DESPLAZAMIENTO, y: lado ? 0 : 6 };
  return (
    <m.div
      key={pathname}
      // La primera pantalla se muestra tal cual: no espera a ninguna animación.
      initial={paso.primera ? false : desde}
      animate={soloFundido ? { opacity: 1 } : { opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.22, ease: EASE_OUT }}
    >
      {outlet}
    </m.div>
  );
}
