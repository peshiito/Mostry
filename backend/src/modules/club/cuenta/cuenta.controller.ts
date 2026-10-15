import type { RequestHandler } from 'express';
import type { Mailer } from '../../../shared/email/mailer.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { zonaDelOrigen } from '../../../shared/utils/origen.js';
import {
  esquemaEmailClub,
  esquemaRegistroClub,
  esquemaVerificarClub,
} from './schemas.js';
import {
  reenviarVerificacionCliente,
  registrarCliente,
  verificarEmailCliente,
} from './registro.service.js';
import { crearSesionClub } from './sesionClub.js';

const MENSAJE_CODIGO = 'Si los datos son correctos, te mandamos un código a tu email.';

// La cuenta del club se crea y se usa desde mostry.com.ar/club.
export const exigirSitio: RequestHandler = (req, _res, next) => {
  if (zonaDelOrigen(req.get('origin'))?.tipo !== 'sitio') {
    throw new AppError(403, 'zona_invalida', 'Entrá desde mostry.com.ar/club.');
  }
  next();
};

export function registroClubController(mailer: Mailer) {
  const registro: RequestHandler = async (req, res) => {
    await registrarCliente(esquemaRegistroClub.parse(req.body), mailer);
    res.status(201).json({ mensaje: MENSAJE_CODIGO });
  };

  // Verificar el código prueba que el email es suyo: ya queda adentro.
  const verificar: RequestHandler = async (req, res) => {
    const { email, codigo, clave } = esquemaVerificarClub.parse(req.body);
    await crearSesionClub(req, res, await verificarEmailCliente(email, codigo, clave));
    res.json({ mensaje: '¡Listo! Ya sos parte del Club.' });
  };

  const reenviar: RequestHandler = async (req, res) => {
    await reenviarVerificacionCliente(esquemaEmailClub.parse(req.body).email, mailer);
    res.status(202).json({ mensaje: MENSAJE_CODIGO });
  };

  return { registro, verificar, reenviar };
}
