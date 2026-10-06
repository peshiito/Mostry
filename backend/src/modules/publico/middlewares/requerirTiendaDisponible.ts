import type { RequestHandler } from 'express';
import { AppError } from '../../../shared/errors/AppError.js';
import { tiendaPublicaRepo } from '../repositorios/tiendaPublica.repository.js';
import { disponibilidad } from '../servicios/disponibilidad.js';

// Catálogo, checkout y seguimiento: solo con la tienda publicada y no suspendida.
export const requerirTiendaDisponible: RequestHandler = async (req, _res, next) => {
  const estado = disponibilidad(await tiendaPublicaRepo.buscar(req.tienda!.id));
  if (estado === 'sin_publicar')
    throw new AppError(404, 'tienda_no_encontrada', 'No encontramos esta tienda.');
  if (estado === 'suspendida') {
    throw new AppError(403, 'tienda_cerrada', 'Esta tienda está cerrada temporalmente.');
  }
  next();
};
