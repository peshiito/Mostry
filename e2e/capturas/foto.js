import { homedir } from 'node:os';
import { join } from 'node:path';

// Carpeta fuera del repo: ~/.cache/mostry-capturas/<claro|oscuro>/<nombre>.png
export const CARPETA = join(homedir(), '.cache', 'mostry-capturas');
export const ESQUEMAS = [
  ['claro', 'light'],
  ['oscuro', 'dark'],
];

// Espera a que no se muevan las animaciones de llegada y saca la captura.
export async function foto(page, esquema, nombre) {
  await page.waitForTimeout(450);
  await page.screenshot({ path: join(CARPETA, esquema, `${nombre}.png`) });
}

// Una respuesta de la API que nunca llega (para fotografiar la carga).
// Devuelve una función que espera a que la pantalla la pida de verdad.
export async function colgar(page, patron) {
  let avisar;
  const pedida = new Promise((listo) => (avisar = listo));
  await page.route(patron, () => avisar());
  return () => pedida;
}
