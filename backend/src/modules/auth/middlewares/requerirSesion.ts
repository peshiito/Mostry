import type { RequestHandler } from 'express';
import { sha256 } from '../../../shared/crypto/tokens.js';
import { sinSesion } from '../errores.js';
import { nombreCookie, tipoDeZona } from '../cookies.js';
import { sesionesRepo } from '../repositorios/sesiones.repository.js';
import { renovarSiHaceFalta } from '../servicios/sesiones.service.js';

// Lee la cookie de la zona (panel o admin) y deja la sesión en req.sesion.
export function requerirSesion(): RequestHandler {
  return async (req, res, next) => {
    const tipo = tipoDeZona(req);
    const token: unknown = req.cookies?.[nombreCookie(tipo)];
    if (typeof token !== 'string' || token.length > 100) throw sinSesion();

    const sesion = await sesionesRepo.buscarVigente(sha256(token));
    const valida = sesion && sesion.tipo === tipo;
    if (!valida || (sesion.tipo === 'admin' && !sesion.esAdmin)) throw sinSesion();

    req.sesion = sesion;
    await renovarSiHaceFalta(res, sesion, token);
    next();
  };
}
