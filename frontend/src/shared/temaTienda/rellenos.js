import { contraste, mezclar, textoSobre } from './color.js';

// Un color que se usa de RELLENO (botón, encabezado) con texto encima: si ni el
// blanco ni el negro llegan a 4.5:1, lo oscurece o aclara de a poco hasta que sí.
export function rellenoLegible(color, minimo = 4.5) {
  if (contraste(textoSobre(color), color) >= minimo) return color;
  for (let t = 0.05; t <= 0.6; t += 0.05) {
    for (const destino of ['#000000', '#ffffff']) {
      const c = mezclar(color, destino, t);
      if (contraste(textoSobre(c), c) >= minimo) return c;
    }
  }
  return mezclar(color, '#000000', 0.6);
}

// Radios según la forma elegida.
export const RADIOS = {
  recta: ['2px', '0px'],
  suave: ['8px', '4px'],
  redonda: ['18px', '10px'],
};
