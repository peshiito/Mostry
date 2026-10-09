import { useEffect, useRef, useState } from 'react';

// Avisa cuando el bloque entra en pantalla (una sola vez) para animar su llegada.
// Sin IntersectionObserver, se muestra directo.
export function useAparecer() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver !== 'function',
  );
  useEffect(() => {
    if (visible || !ref.current) return undefined;
    const observador = new IntersectionObserver(
      ([entrada]) => entrada.isIntersecting && setVisible(true),
      { rootMargin: '0px 0px -12% 0px' },
    );
    observador.observe(ref.current);
    return () => observador.disconnect();
  }, [visible]);
  return [ref, visible];
}
