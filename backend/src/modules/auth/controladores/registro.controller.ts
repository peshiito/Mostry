import type { RequestHandler } from 'express';
import type { Mailer } from '../../../shared/email/mailer.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { zonaDelOrigen } from '../../../shared/utils/origen.js';
import { esquemaEmail, esquemaRegistro, esquemaVerificar } from '../schemas.js';
import { registrar } from '../servicios/registro.service.js';
import {
  reenviarVerificacion,
  verificarEmail,
} from '../servicios/verificacion.service.js';

const MENSAJE_CODIGO = 'Si los datos son correctos, te mandamos un código a tu email.';

export function registroController(mailer: Mailer) {
  const registro: RequestHandler = async (req, res) => {
    if (zonaDelOrigen(req.get('origin'))?.tipo !== 'sitio') {
      throw new AppError(
        403,
        'zona_invalida',
        'El registro se hace desde mostry.com.ar.',
      );
    }
    await registrar(esquemaRegistro.parse(req.body), mailer);
    res.status(201).json({ mensaje: MENSAJE_CODIGO });
  };

  const verificar: RequestHandler = async (req, res) => {
    const { email, codigo } = esquemaVerificar.parse(req.body);
    await verificarEmail(email, codigo);
    res.json({ mensaje: '¡Listo! Tu email quedó verificado.' });
  };

  const reenviar: RequestHandler = async (req, res) => {
    await reenviarVerificacion(esquemaEmail.parse(req.body).email, mailer);
    res.status(202).json({ mensaje: MENSAJE_CODIGO });
  };

  return { registro, verificar, reenviar };
}
