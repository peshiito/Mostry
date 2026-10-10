// Servidor del frontend en producción: sirve el build (dist/) con los MISMOS
// encabezados de seguridad que `vite preview` (encabezados.config.js: CSP con el
// hash del script del tema, anti-clickjacking, etc.). Sin dependencias.
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { encabezados } from '../encabezados.config.js';
import { cacheDe, TIPOS } from './tipos.js';

const RAIZ = fileURLToPath(new URL('../dist/', import.meta.url));
const PUERTO = Number(process.env.PUERTO ?? 8080);
const SEGURIDAD = encabezados({
  api: process.env.VITE_API_URL,
  archivos: process.env.VITE_ORIGEN_ARCHIVOS,
  dev: false,
});

// Ruta pedida → archivo dentro de dist/. Las rutas de la app (sin extensión)
// devuelven index.html (SPA); un archivo con extensión que no existe es 404.
async function resolver(pathname) {
  const archivo = normalize(join(RAIZ, decodeURIComponent(pathname)));
  if (!archivo.startsWith(RAIZ)) return null; // ../ fuera de dist
  const st = await stat(archivo).catch(() => null);
  if (st?.isFile()) return { archivo, ruta: pathname };
  if (extname(pathname)) return null;
  return { archivo: join(RAIZ, 'index.html'), ruta: '/index.html' };
}

createServer(async (req, res) => {
  // Una ruta imposible de interpretar no puede tirar abajo el servidor: 400.
  const url = URL.parse(req.url ?? '/', 'http://local');
  if (!url) {
    res.writeHead(400, SEGURIDAD).end();
    return;
  }
  const { pathname } = url;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  if (pathname === '/salud') {
    res.writeHead(200, { 'Content-Type': 'text/plain' }).end('ok');
    return;
  }
  const encontrado = await resolver(pathname).catch(() => null);
  if (!encontrado) {
    res
      .writeHead(404, { ...SEGURIDAD, 'Content-Type': 'text/plain' })
      .end('No encontrado');
    return;
  }
  res.writeHead(200, {
    ...SEGURIDAD,
    'Content-Type': TIPOS[extname(encontrado.archivo)] ?? 'application/octet-stream',
    'Cache-Control': cacheDe(encontrado.ruta.split(sep).join('/')),
  });
  if (req.method === 'HEAD') res.end();
  else createReadStream(encontrado.archivo).pipe(res);
}).listen(PUERTO, () =>
  process.stdout.write(`Frontend de Mostry en el puerto ${PUERTO}\n`),
);
