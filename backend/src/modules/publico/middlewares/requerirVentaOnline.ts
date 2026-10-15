import type { RequestHandler } from 'express';
import { db } from '../../../shared/db/db.js';
import { AppError } from '../../../shared/errors/AppError.js';

// Catálogo, checkout y encargos: solo si la tienda vende por internet. Si no,
// su dirección muestra la tarjeta de presentación (Mejoras 3, parte A).
export const requerirVentaOnline: RequestHandler = async (req, _res, next) => {
  const t = await db
    .selectFrom('tiendas')
    .select('vendeOnline')
    .where('id', '=', req.tienda!.id)
    .executeTakeFirstOrThrow();
  if (!t.vendeOnline) {
    throw new AppError(403, 'sin_venta_online', 'Esta tienda no vende por internet.');
  }
  next();
};

// La disponibilidad de encargos solo si la tienda los toma.
export const requerirEncargos: RequestHandler = async (req, _res, next) => {
  const t = await db
    .selectFrom('tiendas')
    .select('usaEncargos')
    .where('id', '=', req.tienda!.id)
    .executeTakeFirstOrThrow();
  if (!t.usaEncargos)
    throw new AppError(403, 'sin_encargos', 'Esta tienda no toma encargos.');
  next();
};
