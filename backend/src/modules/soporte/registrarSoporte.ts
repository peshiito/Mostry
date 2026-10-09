import type { RequestHandler } from 'express';
import { db } from '../../shared/db/db.js';
import { logger } from '../../shared/logger.js';
import { textoAccion } from './acciones.js';
import { soporteRepo } from './soporte.repository.js';

const LECTURA = new Set(['GET', 'HEAD', 'OPTIONS']);

// Nombre del producto tocado (para que el comercio entienda qué se cambió).
async function nombreProducto(
  tiendaId: Parameters<typeof soporteRepo.vigente>[0],
  id: unknown,
) {
  if (!id) return undefined;
  const p = await db
    .selectFrom('productos')
    .select('nombre')
    .where('tiendaId', '=', tiendaId)
    .where('id', '=', Number(id))
    .executeTakeFirst();
  return p?.nombre;
}

// Anota cada cambio que salió bien ANTES de mandar la respuesta: cuando el admin
// ve "guardado", el comercio ya lo tiene en su registro. Si anotar falla, se
// avisa en el log pero no se pierde el cambio ya hecho.
export const registrarSoporte: RequestHandler = (req, res, next) => {
  if (LECTURA.has(req.method)) return next();
  const terminar = res.end.bind(res) as (...a: unknown[]) => typeof res;
  res.end = ((...args: unknown[]) => {
    const ok = res.statusCode >= 200 && res.statusCode < 300 && req.route;
    if (!ok) return terminar(...args);
    const ruta = `${req.baseUrl.replace(/^\/admin\/soporte\/[^/]+/, '')}${req.route.path}`;
    const { tiendaId } = req.panel!;
    const { accesoId, adminId } = req.soporte!;
    const fila = { tiendaId, accesoId, adminId, metodo: req.method, ruta };
    const idProducto = ruta.startsWith('/productos/:id') ? req.params.id : undefined;
    nombreProducto(tiendaId, idProducto)
      .then((nombre) =>
        soporteRepo.anotar({ ...fila, accion: textoAccion(req.method, ruta, nombre) }),
      )
      // Con la fila entera en el log se puede completar el registro a mano.
      .catch((err: unknown) =>
        logger.error({ err, fila }, 'No se pudo anotar el cambio de soporte'),
      )
      .finally(() => terminar(...args));
    return res;
  }) as typeof res.end;
  next();
};
