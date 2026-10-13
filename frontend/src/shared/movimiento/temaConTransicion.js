import { flushSync } from 'react-dom';

// Cambia el tema con un círculo que crece desde el botón (View Transitions del
// navegador). Sin soporte o con "reducir movimiento", cambia al instante.
export function temaConTransicion(boton, cambiar) {
  const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || reducir || !boton) return cambiar();
  const r = boton.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const radio = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );
  const transicion = document.startViewTransition(() => flushSync(cambiar));
  transicion.ready
    .then(() =>
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radio}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 480,
          easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      ),
    )
    .catch(() => {}); // si se interrumpe, el tema ya cambió igual
}
