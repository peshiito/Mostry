import type { RequestHandler } from 'express';
import { z } from 'zod';
import { AppError } from '../../shared/errors/AppError.js';
import { tiendasRepo } from '../tiendas/tiendas.repository.js';

const esquemaTienda = z.coerce.number().int().positive();

// Va después de requerirAdmin. Sin un permiso vigente que haya dado el comercio,
// el admin no opera nada de la tienda (403). Con permiso, deja el mismo contexto
// que el panel (req.tienda, req.panel) más req.soporte para el registro.
export const accesoSoporte: RequestHandler = async (req, _res, next) => {
  const id = esquemaTienda.safeParse(req.params.tiendaId);
  const tienda = id.success ? await tiendasRepo.conSoporteVigente(id.data) : undefined;
  if (!tienda) {
    throw new AppError(
      403,
      'sin_permiso_soporte',
      'Esta tienda no te dio acceso de soporte (o ya venció).',
    );
  }
  const adminId = req.sesion!.usuarioId;
  req.tienda = { id: tienda.id, slug: tienda.slug };
  req.panel = { tiendaId: tienda.id, usuarioId: adminId };
  req.soporte = { accesoId: tienda.accesoId, adminId };
  next();
};
