import { useState } from 'react';
import { useAccion } from './useAccion.js';

// useAccion para subir un archivo, con el progreso real de la subida (0 a 1).
// `fn` recibe primero onProgreso, después los argumentos de ejecutar().
export function useSubida(fn, opciones) {
  const [progreso, setProgreso] = useState(null);
  const accion = useAccion((...args) => fn(setProgreso, ...args), opciones);
  async function ejecutar(...args) {
    const r = await accion.ejecutar(...args);
    setProgreso(null);
    return r;
  }
  return { ...accion, ejecutar, progreso };
}
