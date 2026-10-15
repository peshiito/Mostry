import { Router } from 'express';
import type { Mailer } from '../shared/email/mailer.js';
import { rutasCaja } from './caja/caja.routes.js';
import { rutasCatalogo } from './catalogo/catalogo.routes.js';
import { rutasClubPanel } from './club/programa/programa.routes.js';
import { rutasSellosPanel } from './club/sellos/sellosPanel.routes.js';
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
import { requiereModulo } from './tiendas/middlewares/requiereModulo.js';

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
  // Lo que la tienda apagó en "Qué uso de Mostry" también se cierra acá.
  r.use(['/gastos', '/proveedores'], requiereModulo('usaGastos'));
  r.use(rutasGastos());
  r.use('/encargos', requiereModulo('usaEncargos'));
  r.use(rutasEncargosPanel());
  r.use('/libreta', requiereModulo('usaLibreta'));
  r.use(rutasLibreta());
  r.use(rutasClubPanel());
  r.use(rutasSellosPanel());
  r.use(rutasReportes());
  r.use(rutasSoportePanel());
  return r;
}
