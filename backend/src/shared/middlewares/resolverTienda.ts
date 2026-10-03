import type { RequestHandler } from 'express';
import { AppError } from '../errors/AppError.js';
import { zonaDelOrigen } from '../utils/origen.js';

export type TiendaResuelta = { id: number; slug: string };
export type BuscarTiendaPorSlug = (slug: string) => Promise<TiendaResuelta | undefined>;

// Deja en req.tienda la tienda del subdominio que hace la request.
// La búsqueda se inyecta: el repositorio de tiendas llega en la Etapa 4.
export function resolverTienda(buscarPorSlug: BuscarTiendaPorSlug): RequestHandler {
  return async (req, _res, next) => {
    const zona = zonaDelOrigen(req.get('origin'));
    if (zona?.tipo !== 'tienda') {
      throw new AppError(400, 'tienda_requerida', 'No se pudo identificar la tienda.');
    }
    const tienda = await buscarPorSlug(zona.slug);
    if (!tienda) {
      throw new AppError(404, 'tienda_no_encontrada', 'No encontramos esta tienda.');
    }
    req.tienda = tienda;
    next();
  };
}
