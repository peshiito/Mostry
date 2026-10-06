import type { Request, RequestHandler } from 'express';
import { rateLimit } from 'express-rate-limit';
import { responderError } from './respuestaError.js';

export const porEmail = (req: Request) =>
  `email:${String(req.body?.email ?? '')
    .trim()
    .toLowerCase()}`;

// Por cuenta: va DESPUÉS de requerirSesion (frena a quien prueba claves con una
// cookie robada aunque vaya cambiando de IP).
export const porUsuario = (req: Request) =>
  `usuario:${req.sesion?.usuarioId ?? 'anonimo'}`;

// Límite de requests por ventana. Sin clave, cuenta por IP.
export function limite(
  minutos: number,
  maximo: number,
  clave?: (req: Request) => string,
): RequestHandler {
  return rateLimit({
    windowMs: minutos * 60 * 1000,
    limit: maximo,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ...(clave && { keyGenerator: clave }),
    handler: (_req, res) =>
      responderError(
        res,
        429,
        'demasiados_intentos',
        'Demasiados intentos. Esperá unos minutos.',
      ),
  });
}
