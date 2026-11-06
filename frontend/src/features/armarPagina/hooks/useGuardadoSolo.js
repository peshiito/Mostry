import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const ESPERA = 1200;

// Guarda el borrador solo, un ratito después del último cambio. `estado`:
// 'al-dia' | 'pendiente' | 'guardando' | 'error'. `ya()` fuerza el guardado
// (antes de publicar).
export function useGuardadoSolo(doc, guardar) {
  const [estado, setEstado] = useState('al-dia');
  const primero = useRef(true);
  const timer = useRef(null);
  const ultimo = useRef(doc);
  useLayoutEffect(() => {
    ultimo.current = doc;
  }, [doc]);
  const ya = useCallback(async () => {
    clearTimeout(timer.current);
    setEstado('guardando');
    try {
      await guardar(ultimo.current);
      setEstado('al-dia');
      return true;
    } catch {
      setEstado('error');
      return false;
    }
  }, [guardar]);
  useEffect(() => {
    if (!doc) return undefined;
    if (primero.current) {
      primero.current = false;
      return undefined;
    }
    setEstado('pendiente');
    clearTimeout(timer.current);
    timer.current = setTimeout(ya, ESPERA);
    return () => clearTimeout(timer.current);
  }, [doc, ya]);
  return { estado, ya };
}
