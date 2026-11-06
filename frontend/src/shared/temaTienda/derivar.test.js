import { describe, expect, it } from 'vitest';
import { PALETAS } from '../lib/paletas.js';
import { contraste } from './color.js';
import { derivarTokens } from './derivar.js';
import { TEMAS, temaDePaleta } from './temas.js';

// Todo par texto/fondo de la vidriera tiene que leerse (≥ 4.5:1), con cualquier
// tema armado y en los dos modos. También con colores "difíciles" elegidos a mano.
const PARES = [
  ['--carbon', '--lona'],
  ['--carbon', '--papel'],
  ['--texto-2', '--lona'],
  ['--texto-2', '--papel'],
  ['--texto-3', '--papel'],
  ['--verde', '--lona'],
  ['--verde', '--papel'],
  ['--sobre-verde', '--verde'],
  ['--sobre-verde-2', '--verde'],
  ['--sobre-coral', '--coral'],
  ['--sobre-mostaza', '--mostaza'],
  ['--mostaza-texto', '--mostaza-claro'],
];

const dificiles = [
  ['amarillo sobre blanco', '#ffee00', '#fff7a8', '#ffffff'],
  ['gris medio', '#808080', '#8a8a8a', '#9a9a9a'],
  ['todo negro', '#000000', '#111111', '#050505'],
  ['pastel sobre pastel', '#ffd6e7', '#d6f5ff', '#fff3f8'],
].map(([nombre, principal, acento, fondo]) => ({
  clave: nombre,
  tema: { ...TEMAS[0].tema, colores: { principal, acento, fondo } },
}));

const casos = [
  ...TEMAS,
  ...Object.keys(PALETAS).map((p) => ({ clave: `paleta ${p}`, tema: temaDePaleta(p) })),
  ...dificiles,
];

describe.each(casos)('tema $clave', ({ tema }) => {
  it.each(['claro', 'oscuro'])('modo %s: todos los textos se leen', (modo) => {
    const t = derivarTokens(tema, modo);
    for (const [texto, fondo] of PARES)
      expect(
        contraste(t[texto], t[fondo]),
        `${texto} sobre ${fondo}`,
      ).toBeGreaterThanOrEqual(4.5);
  });
});
