import { useEffect, useRef, useState } from 'react';
import { bloqueEn, desplazamiento } from '../lib/marcas.js';

const quieto = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Escucha el puntero sobre la pantalla de la vista previa: qué bloque está
// debajo (para marcarlo) y tocar para elegirlo. Si el bloque se eligió desde la
// lista, lleva la pantalla hasta él. `marca` cambia al hacer scroll (re-dibujar).
export function useBloqueBajo(pantalla, elegido, onElegir) {
  const [bajo, setBajo] = useState(null);
  const [marca, setMarca] = useState(0);
  const desdeVista = useRef(false);
  const elegir = useRef(onElegir);
  useEffect(() => {
    elegir.current = onElegir;
  }, [onElegir]);
  useEffect(() => {
    const el = pantalla;
    el.setAttribute('data-elegible', 'si');
    const mover = (e) => setBajo(bloqueEn(el, e.clientX, e.clientY)?.id ?? null);
    const salir = () => setBajo(null);
    const tocar = (e) => {
      const b = bloqueEn(el, e.clientX, e.clientY);
      if (!b) return;
      desdeVista.current = true;
      elegir.current(b.id);
    };
    const redibujar = () => setMarca((n) => n + 1);
    el.addEventListener('pointermove', mover);
    el.addEventListener('pointerleave', salir);
    el.addEventListener('click', tocar);
    el.addEventListener('scroll', redibujar, { passive: true });
    return () => {
      el.removeAttribute('data-elegible');
      el.removeEventListener('pointermove', mover);
      el.removeEventListener('pointerleave', salir);
      el.removeEventListener('click', tocar);
      el.removeEventListener('scroll', redibujar);
    };
  }, [pantalla]);
  useEffect(() => {
    const el = pantalla;
    if (!elegido || desdeVista.current) {
      desdeVista.current = false;
      return;
    }
    const top = desplazamiento(el, elegido);
    if (top !== null) el.scrollTo({ top, behavior: quieto() ? 'auto' : 'smooth' });
  }, [pantalla, elegido]);
  return { bajo, marca };
}
