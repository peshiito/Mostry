import type { SesionVigente } from '../../modules/auth/repositorios/sesiones.repository.js';
import type { TiendaId } from '../db/tiendaId.js';
import type { TiendaResuelta } from '../middlewares/resolverTienda.js';

declare global {
  namespace Express {
    interface Request {
      // La completa resolverTienda (o accesoSoporte en el modo soporte del admin).
      tienda?: TiendaResuelta;
      // La completa el middleware requerirSesion.
      sesion?: SesionVigente;
      // La completa requerirMiembro (usuario miembro de la tienda) o, en el modo
      // soporte, accesoSoporte (usuarioId es el del ADMIN, que no es miembro).
      // Las rutas la leen con tiendaDelPanel(req); el usuario, con miembroDelPanel(req).
      panel?: { tiendaId: TiendaId; usuarioId: number };
      // La completa accesoSoporte: el admin opera con un permiso vigente del comercio.
      soporte?: { accesoId: number; adminId: number };
    }
  }
}

export {};
