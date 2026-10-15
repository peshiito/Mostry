import { Router } from 'express';
import { limite } from '../../shared/http/rateLimit.js';
import { resolverTienda } from '../../shared/middlewares/resolverTienda.js';
import { rutasComprobantesPublico } from '../comprobantes/comprobantes.routes.js';
import { rutasEncargosPublico } from '../encargos/encargos.routes.js';
import { rutasFotosPublico } from '../encargos/fotos/fotos.routes.js';
import { rutasPedidosPublico } from '../pedidos/pedidos.routes.js';
import { tiendasRepo } from '../tiendas/tiendas.repository.js';
import { pedidosPublicoController } from '../pedidos/controladores/pedidosPublico.controller.js';
import { publicoController as c } from './controladores/publico.controller.js';
import { requerirTiendaDisponible } from './middlewares/requerirTiendaDisponible.js';
import {
  requerirEncargos,
  requerirVentaOnline,
} from './middlewares/requerirVentaOnline.js';

// Tienda pública (sin login). La tienda sale del Origin (subdominio).
const { seguimiento } = pedidosPublicoController;

export function rutasPublico(): Router {
  const r = Router();
  r.use(limite(1, 300), resolverTienda(tiendasRepo.buscarPorSlug));

  // Responden aunque esté suspendida: el frontend muestra "Cerrada temporalmente"
  // y los links de seguimiento siguen andando en solo lectura (decisión 19).
  r.get('/tienda', c.tienda);
  r.get('/pedidos/:token', limite(1, 60), seguimiento);

  r.use(requerirTiendaDisponible);
  // Los comprobantes de pedidos ya hechos siguen andando aunque deje de vender online.
  r.use(rutasComprobantesPublico());
  r.use(rutasFotosPublico()); // foto de referencia de un encargo ya hecho
  r.use(requerirVentaOnline);
  r.get('/categorias', c.categorias);
  r.get('/productos', c.productos);
  r.get('/productos/:id', c.producto);
  r.use(rutasPedidosPublico());
  r.use('/encargos', requerirEncargos);
  r.use(rutasEncargosPublico());
  return r;
}
