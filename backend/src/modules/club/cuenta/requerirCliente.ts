import type { RequestHandler } from 'express';
import { sha256 } from '../../../shared/crypto/tokens.js';
import { sinSesion } from '../../auth/errores.js';
import { COOKIE_CLUB, renovarSesionClub } from './sesionClub.js';
import { sesionesClubRepo } from './sesionesClub.repository.js';

// Lee SOLO la cookie del club y deja la sesión en req.cliente. Nunca mira las
// cookies del panel ni del admin (y requerirSesion nunca mira esta).
export function requerirCliente(): RequestHandler {
  return async (req, res, next) => {
    const token: unknown = req.cookies?.[COOKIE_CLUB];
    if (typeof token !== 'string' || token.length > 100) throw sinSesion();
    const sesion = await sesionesClubRepo.buscarVigente(sha256(token));
    if (!sesion) throw sinSesion();
    req.cliente = sesion;
    await renovarSesionClub(res, sesion, token);
    next();
  };
}
