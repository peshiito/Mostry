import type { RequestHandler } from 'express';
import { AppError } from '../../../shared/errors/AppError.js';
import { miembrosRepo } from '../../tiendas/miembros.repository.js';

// Va después de resolverTienda y requerirSesion: el usuario tiene que
// pertenecer a la tienda del Origin. Así una sesión de A nunca opera en B.
export const requerirMiembro: RequestHandler = async (req, _res, next) => {
  const { tienda, sesion } = req;
  if (
    !tienda ||
    !sesion ||
    !(await miembrosRepo.esMiembro(tienda.id, sesion.usuarioId))
  ) {
    throw new AppError(403, 'sin_acceso', 'No tenés acceso a esta tienda.');
  }
  req.panel = { tiendaId: tienda.id, usuarioId: sesion.usuarioId };
  next();
};
