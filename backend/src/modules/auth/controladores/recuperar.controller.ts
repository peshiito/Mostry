import type { RequestHandler } from 'express';
import type { Mailer } from '../../../shared/email/mailer.js';
import { esquemaEmail, esquemaRecuperar } from '../schemas.js';
import {
  confirmarRecuperacion,
  solicitarRecuperacion,
} from '../servicios/recuperar.service.js';

export function recuperarController(mailer: Mailer) {
  const solicitar: RequestHandler = async (req, res) => {
    await solicitarRecuperacion(esquemaEmail.parse(req.body).email, mailer);
    res
      .status(202)
      .json({ mensaje: 'Si el email está registrado, te mandamos un código.' });
  };

  const confirmar: RequestHandler = async (req, res) => {
    await confirmarRecuperacion(esquemaRecuperar.parse(req.body), mailer);
    res.json({ mensaje: 'Listo, ya podés entrar con tu nueva contraseña.' });
  };

  return { solicitar, confirmar };
}
