import { resolverTienda } from '../../../shared/middlewares/resolverTienda.js';
import { requerirMiembro } from '../../auth/middlewares/requerirMiembro.js';
import { requerirSesion } from '../../auth/middlewares/requerirSesion.js';
import { tiendasRepo } from '../tiendas.repository.js';
import { bloquearSiSuspendida } from './bloquearSiSuspendida.js';

// Cadena común a TODAS las rutas del panel:
// tienda del Origin → sesión completa → miembro de esa tienda → no suspendida.
export const accesoPanel = [
  resolverTienda(tiendasRepo.buscarPorSlug),
  requerirSesion(),
  requerirMiembro,
  bloquearSiSuspendida,
];
