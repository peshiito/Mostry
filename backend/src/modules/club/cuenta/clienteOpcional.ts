import type { RequestHandler } from 'express';
import { sha256 } from '../../../shared/crypto/tokens.js';
import { COOKIE_CLUB } from './sesionClub.js';
import { sesionesClubRepo } from './sesionesClub.repository.js';

// Como requerirCliente, pero sin exigirla: si el comprador entró al Club, el
// checkout de cualquier tienda lo reconoce; si no, sigue como compra común.
export function clienteOpcional(): RequestHandler {
  return async (req, _res, next) => {
    const token: unknown = req.cookies?.[COOKIE_CLUB];
    if (typeof token === 'string' && token.length <= 100) {
      const sesion = await sesionesClubRepo.buscarVigente(sha256(token));
      if (sesion) req.cliente = sesion;
    }
    next();
  };
}
