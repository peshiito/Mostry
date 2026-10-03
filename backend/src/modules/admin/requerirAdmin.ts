import type { RequestHandler } from 'express';
import { AppError } from '../../shared/errors/AppError.js';

// Va después de requerirSesion(). La cookie del panel nunca llega acá como
// admin: requerirSesion elige la cookie por zona, y esto exige tipo 'admin'.
export const requerirAdmin: RequestHandler = (req, _res, next) => {
  if (req.sesion?.tipo !== 'admin' || !req.sesion.esAdmin) {
    throw new AppError(403, 'sin_acceso', 'No tenés acceso a esta sección.');
  }
  next();
};
