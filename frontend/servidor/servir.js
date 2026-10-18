// Servidor del frontend en producción: sirve el build (dist/) con los MISMOS
// encabezados de seguridad que `vite preview` (encabezados.config.js: CSP con el
// hash del script del tema, anti-clickjacking, etc.). Sin dependencias.
import { createReadStream } from 'node:fs';
import { createServer } from 'node:http';
import { extname, sep } from 'node:path';
import { encabezados } from '../encabezados.config.js';
import { resolver } from './archivos.js';
import { encabezadosSitio, redireccionHttps } from './seguridad.js';
import { cacheDe, TIPOS } from './tipos.js';

const PUERTO = Number(process.env.PUERTO ?? 8080);
const DOMINIO = process.env.DOMINIO_BASE;
const SEGURIDAD = encabezadosSitio(
  encabezados({
    api: process.env.VITE_API_URL,
    archivos: process.env.VITE_ORIGEN_ARCHIVOS,
    dev: false,
  }),
  DOMINIO,
);

createServer(async (req, res) => {
  // Una ruta imposible de interpretar no puede tirar abajo el servidor: 400.
  const url = URL.parse(req.url ?? '/', 'http://local');
  if (!url) {
    res.writeHead(400, SEGURIDAD).end();
    return;
  }
  const { pathname } = url;
  const proto = req.headers['x-forwarded-proto'];
  const destino = redireccionHttps({
    proto,
    host: req.headers.host,
    url: req.url,
    dominio: DOMINIO,
  });
  if (destino) {
    res.writeHead(301, { ...SEGURIDAD, Location: destino }).end();
    return;
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { ...SEGURIDAD, Allow: 'GET, HEAD' }).end();
    return;
  }
  if (pathname === '/salud') {
    res.writeHead(200, { ...SEGURIDAD, 'Content-Type': 'text/plain' }).end('ok');
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
