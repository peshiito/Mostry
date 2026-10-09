import { useEffect, useRef, useState } from 'react';
import { cerrarAviso } from './avisos.js';

// Cierra el aviso cuando se le acaba el tiempo. El reloj se frena mientras
// la persona está mirando la pila (hover) o la pestaña está oculta.
export function useTemporizador(id, duracion, pausado) {
  const restante = useRef(duracion);
  const [oculta, setOculta] = useState(() => document.hidden);
  useEffect(() => {
    const cambio = () => setOculta(document.hidden);
    document.addEventListener('visibilitychange', cambio);
    return () => document.removeEventListener('visibilitychange', cambio);
  }, []);
  useEffect(() => {
    // Infinity: aviso fijo (setTimeout lo tomaría como 0 y lo cerraría al toque).
    if (pausado || oculta || !Number.isFinite(restante.current)) return undefined;
    const inicio = Date.now();
    const reloj = setTimeout(() => cerrarAviso(id), restante.current);
    return () => {
      clearTimeout(reloj);
      restante.current -= Date.now() - inicio;
    };
  }, [id, pausado, oculta]);
}
