// Controla la regla de 70 líneas también en los CSS (ESLint no los mira).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const EXCEPCIONES = new Set(['tokens.css']);
const largos = [];
function recorrer(dir) {
  for (const nombre of readdirSync(dir)) {
    const ruta = join(dir, nombre);
    if (statSync(ruta).isDirectory()) recorrer(ruta);
    else if (nombre.endsWith('.css') && !EXCEPCIONES.has(nombre)) {
      const n = readFileSync(ruta, 'utf8').split('\n').length;
      if (n > 70) largos.push(`${ruta}: ${n} líneas`);
    }
  }
}
recorrer('src');
if (largos.length) {
  process.stderr.write(`CSS de más de 70 líneas:\n${largos.join('\n')}\n`);
  process.exit(1);
}
