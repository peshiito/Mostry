import type { RequestHandler } from 'express';
import { AppError } from '../errors/AppError.js';
import { esOrigenPermitido } from '../utils/origen.js';

const METODOS_SEGUROS = new Set(['GET', 'HEAD', 'OPTIONS']);

// Anti-CSRF: toda request que modifica datos tiene que traer un Origin nuestro.
export const verificarOrigen: RequestHandler = (req, _res, next) => {
  if (METODOS_SEGUROS.has(req.method) || esOrigenPermitido(req.get('origin'))) {
    next();
    return;
  }
  next(new AppError(403, 'origen_no_permitido', 'No se pudo procesar la solicitud.'));
};
