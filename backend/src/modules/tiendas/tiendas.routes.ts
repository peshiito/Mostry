import { Router } from 'express';
import type { Mailer } from '../../shared/email/mailer.js';
import { recibirArchivo } from '../../shared/archivos/recibirArchivo.js';
import { limite, porUsuario } from '../../shared/http/rateLimit.js';
import { cobroController } from './controladores/cobro.controller.js';
import { logoController as logo } from './controladores/logo.controller.js';
import { tiendaController as tienda } from './controladores/tienda.controller.js';

// "Mi tienda" y "Suscripción". El acceso (sesión, tienda, suspensión) lo pone rutasPanel.
export function rutasTienda(mailer: Mailer): Router {
  const r = Router();

  r.get('/config', tienda.ver);
  r.patch('/config', tienda.editar);
  r.put('/pausa', tienda.pausa);
  // Pide la contraseña: límite por IP y por cuenta (sección 7).
  r.put('/cobro', limite(10, 10), limite(15, 5, porUsuario), cobroController(mailer));
  r.get('/suscripcion', tienda.suscripcion);
  r.put('/logo', limite(10, 20), recibirArchivo('logo'), logo.subir);
  r.delete('/logo', logo.quitar);
  return r;
}
