import { Router } from 'express';
import type { Mailer } from '../../shared/email/mailer.js';
import { limite } from '../../shared/http/rateLimit.js';
import { cobroController } from './controladores/cobro.controller.js';
import { tiendaController as tienda } from './controladores/tienda.controller.js';
import { accesoPanel } from './middlewares/accesoPanel.js';

// "Mi tienda" y "Suscripción" del panel del comerciante.
export function rutasTienda(mailer: Mailer): Router {
  const r = Router();
  r.use(...accesoPanel);

  r.get('/config', tienda.ver);
  r.patch('/config', tienda.editar);
  r.put('/pausa', tienda.pausa);
  r.put('/cobro', limite(10, 10), cobroController(mailer));
  r.get('/suscripcion', tienda.suscripcion);
  return r;
}
