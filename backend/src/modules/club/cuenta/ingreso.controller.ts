import type { RequestHandler } from 'express';
import type { Mailer } from '../../../shared/email/mailer.js';
import {
  autenticarCliente,
  confirmarRecuperacionCliente,
  solicitarRecuperacionCliente,
} from './ingreso.service.js';
import { esquemaEmailClub, esquemaLoginClub, esquemaRecuperarClub } from './schemas.js';
import { borrarCookieClub, crearSesionClub } from './sesionClub.js';
import { sesionesClubRepo } from './sesionesClub.repository.js';

export function ingresoClubController(mailer: Mailer) {
  const login: RequestHandler = async (req, res) => {
    const { email, clave } = esquemaLoginClub.parse(req.body);
    await crearSesionClub(req, res, await autenticarCliente(email, clave));
    res.json({ mensaje: '¡Hola de nuevo!' });
  };

  const logout: RequestHandler = async (req, res) => {
    await sesionesClubRepo.borrar(req.cliente!.id);
    borrarCookieClub(res);
    res.status(204).end();
  };

  const recuperar: RequestHandler = async (req, res) => {
    await solicitarRecuperacionCliente(esquemaEmailClub.parse(req.body).email, mailer);
    res
      .status(202)
      .json({ mensaje: 'Si el email está registrado, te mandamos un código.' });
  };

  const confirmar: RequestHandler = async (req, res) => {
    await confirmarRecuperacionCliente(esquemaRecuperarClub.parse(req.body), mailer);
    res.json({ mensaje: 'Listo, ya podés entrar con tu nueva clave.' });
  };

  return { login, logout, recuperar, confirmar };
}
