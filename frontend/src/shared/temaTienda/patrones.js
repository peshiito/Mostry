import { mezclar } from './color.js';
import { PATRONES_A } from './patronesA.js';
import { PATRONES_B } from './patronesB.js';

export const PATRONES = { ...PATRONES_A, ...PATRONES_B };

// Imagen de fondo de la vidriera. El trazo apenas se separa del fondo (hasta un
// 14 %), así el texto que va encima sigue leyéndose.
export function imagenFondo(tema, tokens) {
  const dibujo = PATRONES[tema.fondo?.patron];
  if (tema.fondo?.tipo !== 'patron' || !dibujo) return 'none';
  const fuerza = 0.04 + (Math.min(100, Math.max(0, tema.fondo.intensidad)) / 100) * 0.1;
  const trazo = mezclar(tokens['--lona'], tokens['--carbon'], fuerza);
  const acento = mezclar(tokens['--lona'], tokens['--coral'], fuerza + 0.1);
  return `url("data:image/svg+xml,${encodeURIComponent(dibujo(trazo, acento))}")`;
}
