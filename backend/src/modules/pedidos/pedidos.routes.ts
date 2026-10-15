import { clienteOpcional } from '../club/cuenta/clienteOpcional.js';
import { Router } from 'express';
import { limite } from '../../shared/http/rateLimit.js';
import { pedidosPanelController as panel } from './controladores/pedidosPanel.controller.js';
import { pedidosPublicoController as publico } from './controladores/pedidosPublico.controller.js';

// Panel. El acceso (sesión, tienda, suspensión) lo pone rutasPanel.
export function rutasPedidosPanel(): Router {
  const r = Router();
  r.get('/pedidos', panel.listar);
  r.get('/pedidos/:id', panel.ver);
  r.post('/pedidos/:id/estado', panel.avanzar);
  r.post('/pedidos/:id/cancelar', panel.cancelar);
  return r;
}

// Público: checkout con rate limit (sección 7). La tienda y su disponibilidad
// las resuelve rutasPublico (el seguimiento por token se monta allá).
export function rutasPedidosPublico(): Router {
  const r = Router();
  // Si el comprador entró al Club, el pedido queda a su nombre (Lealtad L3).
  r.post('/pedidos', limite(10, 10), clienteOpcional(), publico.crear);
  return r;
}
