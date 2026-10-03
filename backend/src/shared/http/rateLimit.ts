import type { Request, RequestHandler } from 'express';
import { rateLimit } from 'express-rate-limit';
import { responderError } from './respuestaError.js';

export const porEmail = (req: Request) =>
  `email:${String(req.body?.email ?? '')
    .trim()
    .toLowerCase()}`;

// Límite de requests por ventana. Sin clave, cuenta por IP.
export function limite(
  minutos: number,
  maximo: number,
  clave?: typeof porEmail,
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
