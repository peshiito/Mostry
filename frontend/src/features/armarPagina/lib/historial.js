import { aplicar } from './aplicar.js';

const MAX = 60;

// Estado del editor con deshacer y rehacer. Escribir en un mismo campo seguido
// cuenta como un solo cambio (si no, "deshacer" iría letra por letra).
export function editor(estado, a) {
  if (a.tipo === 'cargar') return { doc: a.doc, antes: [], despues: [], ultimo: null };
  if (a.tipo === 'deshacer') {
    if (!estado.antes.length) return estado;
    return {
      doc: estado.antes.at(-1),
      antes: estado.antes.slice(0, -1),
      despues: [estado.doc, ...estado.despues],
      ultimo: null,
    };
  }
  if (a.tipo === 'rehacer') {
    if (!estado.despues.length) return estado;
    return {
      doc: estado.despues[0],
      antes: [...estado.antes, estado.doc],
      despues: estado.despues.slice(1),
      ultimo: null,
    };
  }
  const doc = aplicar(estado.doc, a);
  if (doc === estado.doc) return estado;
  const clave =
    a.tipo === 'datos' ? `datos:${a.id}:${Object.keys(a.datos).join()}` : null;
  const seguido = clave && clave === estado.ultimo;
  return {
    doc,
    antes: seguido ? estado.antes : [...estado.antes, estado.doc].slice(-MAX),
    despues: [],
    ultimo: clave,
  };
}
