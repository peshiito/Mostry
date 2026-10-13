import { useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

const DURACION = 500;
const salir = (t) => 1 - (1 - t) ** 4; // desacelera al llegar, como --ease-out

// Un número que cuenta hasta su valor (de 0 la primera vez, después desde el
// anterior). Mientras cuenta va de a pesos enteros (`paso`), y termina en el
// valor exacto. Con "reducir movimiento", o `activo` en false, muestra el valor.
export function useContar(valor, { activo = true, paso = 100 } = {}) {
  const reducir = useReducedMotion();
  const anima = activo && !reducir && Number.isFinite(valor);
  const [mostrado, setMostrado] = useState(0);
  const desde = useRef(0);
  useEffect(() => {
    if (!anima) return undefined;
    const inicio = performance.now();
    const origen = desde.current;
    let cuadro;
    const avanzar = (ahora) => {
      const t = Math.min((ahora - inicio) / DURACION, 1);
      const v = origen + (valor - origen) * salir(t);
      desde.current = v;
      setMostrado(t < 1 ? Math.round(v / paso) * paso : valor);
      if (t < 1) cuadro = requestAnimationFrame(avanzar);
    };
    cuadro = requestAnimationFrame(avanzar);
    return () => cancelAnimationFrame(cuadro);
  }, [valor, anima, paso]);
  return anima ? mostrado : valor;
}
