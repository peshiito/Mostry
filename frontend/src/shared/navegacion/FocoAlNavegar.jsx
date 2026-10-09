import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router';

// Al pasar a otra pantalla: arranca arriba (salvo al volver atrás) y el foco va
// al título (h1), así un lector de pantalla anuncia dónde estás. La pantalla
// puede tardar en aparecer (carga diferida): se espera hasta 1 s a que esté.
export function FocoAlNavegar() {
  const { pathname } = useLocation();
  const tipo = useNavigationType();
  // Se compara con la ruta anterior (y no con "primera vez"): en desarrollo
  // React corre los efectos dos veces y no tiene que mover el foco al cargar.
  const anterior = useRef(pathname);
  useEffect(() => {
    if (anterior.current === pathname) return undefined;
    anterior.current = pathname;
    if (tipo !== 'POP') window.scrollTo(0, 0);
    let intentos = 0;
    let cuadro;
    const buscar = () => {
      const titulo = document.querySelector('#contenido h1, h1');
      if (titulo) {
        if (!titulo.hasAttribute('tabindex')) titulo.setAttribute('tabindex', '-1');
        titulo.focus({ preventScroll: true });
      } else if (intentos++ < 60) cuadro = requestAnimationFrame(buscar);
    };
    cuadro = requestAnimationFrame(buscar);
    return () => cancelAnimationFrame(cuadro);
  }, [pathname, tipo]);
  return null;
}
