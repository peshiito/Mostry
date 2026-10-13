import { useEffect, useState, useSyncExternalStore } from 'react';
import { almacenProgreso } from './progreso.js';
import css from './BarraProgreso.module.css';

const DEMORA_MS = 150; // si la carga es más rápida, la barra ni aparece
const SALIDA_MS = 350; // al terminar, se ve completa un instante y se va

// Línea fina arriba de todo mientras se baja una pantalla o sus datos. Avanza
// solo cuando termina una tarea real (progreso.js), nunca por tiempo.
export function BarraProgreso() {
  const { activa, valor } = useSyncExternalStore(
    almacenProgreso.suscribir,
    almacenProgreso.leer,
  );
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(activa), activa ? DEMORA_MS : SALIDA_MS);
    return () => clearTimeout(t);
  }, [activa]);
  // Arranca con una punta visible: "empezó", aunque todavía no terminó nada.
  const avance = activa ? Math.max(valor, 0.08) : 1;
  return (
    <div
      className={`${css.barra} ${visible ? css.visible : ''}`}
      style={{ '--avance': avance }}
      role={visible ? 'progressbar' : undefined}
      aria-label={visible ? 'Cargando la pantalla' : undefined}
      aria-valuemin={visible ? 0 : undefined}
      aria-valuemax={visible ? 100 : undefined}
      aria-valuenow={visible ? Math.round(avance * 100) : undefined}
      aria-hidden={visible ? undefined : true}
    />
  );
}
