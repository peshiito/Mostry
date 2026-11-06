import { useLayoutEffect, useState } from 'react';

// Cuánto achicar una página de `ancho` px para que entre en `ref` (vista "compu").
export function useZoom(ref, ancho, activo) {
  const [zoom, setZoom] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!activo || !el) return undefined;
    const medir = () => setZoom(Math.min(1, el.clientWidth / ancho));
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, ancho, activo]);
  return zoom;
}
