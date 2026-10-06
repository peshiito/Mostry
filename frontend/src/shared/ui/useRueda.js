import { useEffect, useImperativeHandle, useRef } from 'react';

export const ALTO = 44; // alto de cada opción (área táctil mínima)

// Lógica de una rueda: ubicarse al abrir, avisar el valor cuando frena,
// ir a una opción (tocándola o con el teclado) y leer lo que está en el centro.
export function useRueda({ valores, valor, onCambio, abierta, ref }) {
  const lista = useRef(null);
  const reloj = useRef(null);
  const indice = Math.max(0, valores.indexOf(valor));
  const enElCentro = () => {
    const i = Math.round(lista.current.scrollTop / ALTO);
    return valores[Math.min(valores.length - 1, Math.max(0, i))];
  };
  useImperativeHandle(ref, () => ({ leer: enElCentro }));
  useEffect(() => () => clearTimeout(reloj.current), []);
  useEffect(() => {
    if (!abierta) return undefined;
    const cuadro = requestAnimationFrame(() => {
      if (lista.current) lista.current.scrollTop = indice * ALTO;
    });
    return () => cancelAnimationFrame(cuadro);
    // Solo al abrir: después manda el dedo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierta]);

  const ir = (i) => lista.current.scrollTo({ top: i * ALTO, behavior: 'smooth' });
  function alDeslizar() {
    clearTimeout(reloj.current);
    reloj.current = setTimeout(() => {
      const v = enElCentro();
      if (v !== valor) onCambio(v);
    }, 80);
  }
  // Con teclado es un solo control: flechas, Inicio y Fin.
  const TECLAS = { ArrowUp: -1, ArrowDown: 1, Home: -indice, End: valores.length };
  function alTeclear(e) {
    if (!(e.key in TECLAS)) return;
    e.preventDefault();
    ir(Math.min(valores.length - 1, Math.max(0, indice + TECLAS[e.key])));
  }
  return { lista, ir, alDeslizar, alTeclear };
}
