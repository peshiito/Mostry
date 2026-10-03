import type { RequestHandler } from 'express';
import type { Mailer } from '../../../shared/email/mailer.js';
import { esquemaCambiarClave } from '../schemas.js';
import { cambiarClave, datosDeCuenta } from '../servicios/cuenta.service.js';

export function cuentaController(mailer: Mailer) {
  const yo: RequestHandler = async (req, res) => {
    res.json(await datosDeCuenta(req.sesion!.usuarioId));
  };

  const cambiar: RequestHandler = async (req, res) => {
    await cambiarClave(req.sesion!, esquemaCambiarClave.parse(req.body), mailer);
    res.json({ mensaje: 'Cambiaste tu contraseña. Cerramos tus otras sesiones.' });
  };

  return { yo, cambiar };
}
