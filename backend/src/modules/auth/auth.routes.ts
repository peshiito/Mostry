import { Router } from 'express';
import type { Mailer } from '../../shared/email/mailer.js';
import { cuentaController } from './controladores/cuenta.controller.js';
import { loginController as login } from './controladores/login.controller.js';
import { recuperarController } from './controladores/recuperar.controller.js';
import { registroController } from './controladores/registro.controller.js';
import { totpController as totp } from './controladores/totp.controller.js';
import { crearLimites } from './limites.js';
import { requerirSesion } from './middlewares/requerirSesion.js';

const PARCIAL_TOTP = requerirSesion(['falta_totp']);
const PARCIAL_CONFIGURAR = requerirSesion(['falta_configurar_totp']);
const CUALQUIERA = requerirSesion(['falta_totp', 'falta_configurar_totp', 'completa']);

export function rutasAuth(mailer: Mailer): Router {
  const r = Router();
  const l = crearLimites();
  const registro = registroController(mailer);
  const recuperar = recuperarController(mailer);
  const cuenta = cuentaController(mailer);

  r.post('/registro', l.registro, registro.registro);
  r.post('/verificar-email', l.codigosIp, registro.verificar);
  r.post('/verificar-email/reenviar', l.codigosIp, l.codigosEmail, registro.reenviar);

  r.post('/login', l.loginIp, l.loginEmail, login.login);
  r.post('/login/totp', l.totp, PARCIAL_TOTP, login.loginTotp);
  r.post('/totp/preparar', PARCIAL_CONFIGURAR, totp.preparar);
  r.post('/totp/activar', l.totp, PARCIAL_CONFIGURAR, totp.activar);
  r.post('/logout', CUALQUIERA, login.logout);

  r.post('/recuperar', l.codigosIp, l.codigosEmail, recuperar.solicitar);
  r.post('/recuperar/confirmar', l.codigosIp, l.codigosEmail, recuperar.confirmar);

  r.get('/yo', requerirSesion(), cuenta.yo);
  r.post('/cambiar-clave', l.totp, requerirSesion(), cuenta.cambiar);
  return r;
}
