import { useRef, useState } from 'react';

const DISTANCIA = 70;
const VELOCIDAD = 0.11; // px/ms: un movimiento rápido alcanza aunque sea corto

// Deslizar hacia la derecha para descartar. Hacia la izquierda se mueve con
// fricción (no hay un tope duro). Captura el puntero para no perder el arrastre.
export function useDeslizar(onDescartar) {
  const [dx, setDx] = useState(0);
  const [arrastrando, setArrastrando] = useState(false);
  const inicio = useRef(null);
  const manejadores = {
    onPointerDown(e) {
      if (inicio.current || e.button !== 0 || e.target.closest('button')) return;
      inicio.current = { x: e.clientX, t: Date.now() };
      e.currentTarget.setPointerCapture(e.pointerId);
      setArrastrando(true);
    },
    onPointerMove(e) {
      if (!inicio.current) return;
      const d = e.clientX - inicio.current.x;
      setDx(d > 0 ? d : d / 5);
    },
    onPointerUp() {
      if (!inicio.current) return;
      const velocidad = dx / (Date.now() - inicio.current.t);
      inicio.current = null;
      setArrastrando(false);
      if (dx > DISTANCIA || (dx > 10 && velocidad > VELOCIDAD)) onDescartar();
      else setDx(0);
    },
  };
  manejadores.onPointerCancel = manejadores.onPointerUp;
  return { dx, arrastrando, manejadores };
}
