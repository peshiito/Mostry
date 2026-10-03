import type { RequestHandler } from 'express';
import { AppError } from '../../../shared/errors/AppError.js';
import { estaSuspendida } from '../servicios/suscripcion.service.js';

const SOLO_LECTURA = new Set(['GET', 'HEAD', 'OPTIONS']);

// Tienda suspendida: el panel queda en solo lectura. Lo bloquea la API,
// no solo el frontend (sección 6.5).
export const bloquearSiSuspendida: RequestHandler = async (req, _res, next) => {
  if (!SOLO_LECTURA.has(req.method) && (await estaSuspendida(req.tienda!.id))) {
    throw new AppError(
      403,
      'tienda_suspendida',
      'Tu tienda está suspendida: podés ver tus datos, pero no cambiarlos hasta registrar el pago.',
    );
  }
  next();
};
