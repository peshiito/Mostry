import { Router } from 'express';
import { requerirSesion } from '../auth/middlewares/requerirSesion.js';
import { pagosController as pagos } from './controladores/pagos.controller.js';
import { tiendasAdminController as tiendas } from './controladores/tiendas.controller.js';
import { requerirAdmin } from './requerirAdmin.js';

// Solo desde admin.mostry.com.ar, con sesión de admin.
export function rutasAdmin(): Router {
  const r = Router();
  r.use(requerirSesion(), requerirAdmin);

  r.get('/tiendas', tiendas.listar);
  r.get('/tiendas/:id', tiendas.detalle);
  r.post('/tiendas/:id/pagos', pagos.registrar);
  r.post('/tiendas/:id/suspender', tiendas.suspender);
  r.post('/tiendas/:id/reactivar', tiendas.reactivar);
  r.get('/metricas', pagos.verMetricas);
  return r;
}
