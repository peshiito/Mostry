import { Router } from 'express';
import { recibirArchivo } from '../../shared/archivos/recibirArchivo.js';
import { limite } from '../../shared/http/rateLimit.js';
import { comprobantesController as c } from './controladores/comprobantes.controller.js';

// Panel (acceso lo pone rutasPanel): revisar y ver comprobantes de un pedido.
export function rutasComprobantesPanel(): Router {
  const r = Router();
  r.get('/pedidos/:id/comprobantes', c.listar);
  r.get('/pedidos/:id/comprobantes/:cid/archivo', c.archivo);
  r.post('/pedidos/:id/comprobantes/:cid/aprobar', c.aprobar);
  r.post('/pedidos/:id/comprobantes/:cid/rechazar', c.rechazar);
  return r;
}

// Público: el comprador sube el comprobante desde su link (rate limit, sección 7).
export function rutasComprobantesPublico(): Router {
  const r = Router();
  r.post(
    '/pedidos/:token/comprobante',
    limite(10, 10),
    recibirArchivo('comprobante'),
    c.subir,
  );
  return r;
}
