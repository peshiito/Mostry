import { contraste, mezclar } from './color.js';
import { temaEfectivo } from './temas.js';
import { propsColoresPanel } from '../lib/paletas.js';

// Oscurece el color hasta que el texto blanco del panel se lea (≥ 4.5:1).
export function paraTextoBlanco(color) {
  for (let t = 0; t <= 1; t += 0.05) {
    const c = mezclar(color, '#000000', t);
    if (contraste('#ffffff', c) >= 4.5) return c;
  }
  return '#000000';
}

export const propsPanelTienda = (tienda) =>
  propsColoresPanel(temaEfectivo(tienda).colores, paraTextoBlanco);
