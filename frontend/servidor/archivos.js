import { stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = fileURLToPath(new URL('../dist/', import.meta.url));

// Ruta pedida → archivo dentro de dist/. Las rutas de la app (sin extensión)
// devuelven index.html (SPA); un archivo con extensión que no existe es 404.
export async function resolver(pathname) {
  const archivo = normalize(join(RAIZ, decodeURIComponent(pathname)));
  if (!archivo.startsWith(RAIZ)) return null; // ../ fuera de dist
  const st = await stat(archivo).catch(() => null);
  if (st?.isFile()) return { archivo, ruta: pathname };
  if (extname(pathname)) return null;
  return { archivo: join(RAIZ, 'index.html'), ruta: '/index.html' };
}
