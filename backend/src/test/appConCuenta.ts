import { crearApp } from '../app.js';
import { crearCuentaCompleta } from './flujoAuth.js';
import { limpiarBase } from './limpiarBase.js';
import { crearMailerFalso } from './mailerFalso.js';
import { panel } from './panel.js';

// Base limpia + app + una tienda con su dueña logueada (sesión completa).
export async function appConCuenta(slug = 'dona-rosa') {
  await limpiarBase();
  const correo = crearMailerFalso();
  const app = crearApp({ pingDb: async () => {}, mailer: correo.mailer });
  const cuenta = await crearCuentaCompleta(app, correo, slug);
  return { app, correo, cuenta, panel: panel(app, slug, cuenta.cookie) };
}
