import type { TiendaResuelta } from '../middlewares/resolverTienda.js';

declare global {
  namespace Express {
    interface Request {
      // La completa el middleware resolverTienda.
      tienda?: TiendaResuelta;
    }
  }
}

export {};
