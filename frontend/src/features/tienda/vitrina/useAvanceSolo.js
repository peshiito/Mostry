import { useEffect } from 'react';

// Hace avanzar solo un carrusel con scroll (de a una tarjeta, cada 4 s). Se
// frena con el mouse encima, al tocarlo o con el foco adentro, y con "reducir
// movimiento" no se mueve. Al llegar al final vuelve al principio.
export function useAvanceSolo(ref, activo) {
  useEffect(() => {
    const el = ref.current;
    if (!activo || !el || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return undefined;
    let quieto = false;
    const frenar = () => (quieto = true);
    const seguir = () => (quieto = false);
    const eventos = [
      ['pointerenter', frenar],
      ['pointerleave', seguir],
      ['focusin', frenar],
      ['focusout', seguir],
      ['touchstart', frenar],
    ];
    eventos.forEach(([e, f]) => el.addEventListener(e, f, { passive: true }));
    const t = setInterval(() => {
      if (quieto || document.hidden) return;
      const paso = el.firstElementChild?.getBoundingClientRect().width ?? 200;
      const alFinal = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({ left: alFinal ? 0 : el.scrollLeft + paso + 12, behavior: 'smooth' });
    }, 4000);
    return () => {
      clearInterval(t);
      eventos.forEach(([e, f]) => el.removeEventListener(e, f));
    };
  }, [ref, activo]);
}
