import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

// El script del tema va en línea en el <head>: corre antes del primer dibujo
// (sin destello del modo equivocado) y sin pedir otro archivo.
const codigo = readFileSync(new URL('./tema-inicial.js', import.meta.url), 'utf8');

// Hash para la CSP: autoriza exactamente este script y ningún otro en línea.
export const HASH_TEMA = `'sha256-${createHash('sha256').update(codigo).digest('base64')}'`;

export const temaEnLinea = () => ({
  name: 'mostry-tema-en-linea',
  transformIndexHtml: () => [{ tag: 'script', children: codigo, injectTo: 'head' }],
});
