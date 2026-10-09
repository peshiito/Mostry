import { Router } from 'express';
import { rutasCatalogo } from '../catalogo/catalogo.routes.js';
import { rutasHorarios } from '../horarios/horarios.routes.js';
import { bloquearSiSuspendida } from '../tiendas/middlewares/bloquearSiSuspendida.js';
import { accesoSoporte } from './accesoSoporte.js';
import { rutasTiendaSoporte } from './configSoporte.js';
import { registrarSoporte } from './registrarSoporte.js';

// /admin/soporte/:tiendaId/… (detrás de requerirAdmin). SOLO catálogo, horarios
// y datos de la tienda: pedidos, caja, gastos, encargos, libreta, comprobantes,
// promociones, cobro y suscripción no existen acá (404), ni con permiso.
export function rutasSoporteAdmin(): Router {
  const r = Router({ mergeParams: true });
  r.use(accesoSoporte, bloquearSiSuspendida, registrarSoporte);
  r.use(rutasCatalogo());
  r.use(rutasHorarios());
  r.use('/tienda', rutasTiendaSoporte());
  return r;
}
