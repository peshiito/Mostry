import { Router } from 'express';
import type { Mailer } from '../shared/email/mailer.js';
import { rutasCaja } from './caja/caja.routes.js';
import { rutasCatalogo } from './catalogo/catalogo.routes.js';
import { rutasComprobantesPanel } from './comprobantes/comprobantes.routes.js';
import { rutasEncargosPanel } from './encargos/encargos.routes.js';
import { rutasGastos } from './gastos/gastos.routes.js';
import { rutasHorarios } from './horarios/horarios.routes.js';
import { rutasLibreta } from './libreta/libreta.routes.js';
import { rutasPedidosPanel } from './pedidos/pedidos.routes.js';
import { rutasPromociones } from './promociones/promociones.routes.js';
import { rutasReportes } from './reportes/reportes.routes.js';
import { rutasSoportePanel } from './soporte/soporte.routes.js';
import { accesoPanel } from './tiendas/middlewares/accesoPanel.js';
import { rutasTienda } from './tiendas/tiendas.routes.js';

// Todo el panel del comerciante pasa UNA vez por accesoPanel:
// tienda del Origin → sesión completa → miembro → no suspendida.
export function rutasPanel(mailer: Mailer): Router {
  const r = Router();
  r.use(...accesoPanel);
  r.use('/tienda', rutasTienda(mailer));
  r.use(rutasCatalogo());
  r.use(rutasHorarios());
  r.use(rutasPromociones());
  r.use(rutasPedidosPanel());
  r.use(rutasCaja());
  r.use(rutasComprobantesPanel());
  r.use(rutasGastos());
  r.use(rutasEncargosPanel());
  r.use(rutasLibreta());
  r.use(rutasReportes());
  r.use(rutasSoportePanel());
  return r;
}
