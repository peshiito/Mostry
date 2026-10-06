import { Router } from 'express';
import { cajaController as c } from './controladores/caja.controller.js';

// Caja del panel. El acceso (sesión, tienda, suspensión) lo pone rutasPanel.
export function rutasCaja(): Router {
  const r = Router();
  r.get('/caja', c.actual);
  r.post('/caja/abrir', c.abrir);
  r.post('/caja/cerrar', c.cerrar);
  r.post('/caja/movimientos', c.movimiento);
  r.get('/caja/resumen', c.resumen);
  r.get('/caja/historial', c.historial);
  return r;
}
