import { randomUUID } from 'node:crypto';
import { borrarPublicos, subirWebp } from '../../../shared/archivos/almacenamiento.js';
import { prefijoTienda } from '../../../shared/archivos/claves.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { anotarMedio } from './anotarMedio.js';
import { archivosDeMedio, procesarMedio } from './procesarMedio.js';
import { validarMedio } from './validarMedio.js';

// Suma una imagen a la biblioteca de la tienda. Se sube primero y se anota con
// la tienda bloqueada (dos subidas a la vez no pasan los topes); si no entra,
// se borran los archivos.
export async function agregarMedio(tiendaId: TiendaId, datos: Buffer) {
  const info = await validarMedio(datos);
  const salidas = await procesarMedio(datos, info);
  const tipo = info.animado ? ('animado' as const) : ('foto' as const);
  const base = `${prefijoTienda(tiendaId)}medios/${randomUUID()}`;
  const claves = archivosDeMedio(base, tipo);
  await Promise.all(claves.map((c, i) => subirWebp(c, salidas[i] ?? Buffer.alloc(0))));
  const bytes = salidas.reduce((t, s) => t + s.length, 0);
  try {
    return await anotarMedio(tiendaId, {
      clave: base,
      tipo,
      ancho: info.ancho,
      alto: info.alto,
      bytes,
    });
  } catch (err) {
    await borrarPublicos(tiendaId, claves);
    throw err;
  }
}
