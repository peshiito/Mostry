import type { SesionVigente } from '../../modules/auth/repositorios/sesiones.repository.js';
import type { TiendaResuelta } from '../middlewares/resolverTienda.js';

declare global {
  namespace Express {
    interface Request {
      // La completa el middleware resolverTienda.
      tienda?: TiendaResuelta;
      // La completa el middleware requerirSesion.
      sesion?: SesionVigente;
    }
  }
}

export {};
