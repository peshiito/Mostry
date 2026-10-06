import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';
import { responderError } from '../http/respuestaError.js';
import { logger } from '../logger.js';

const CODIGOS_4XX: Record<number, string> = {
  400: 'solicitud_invalida',
  413: 'demasiado_grande',
};

// Al cliente, mensajes genéricos; el detalle va solo a los logs.
export const manejarErrores: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof AppError) {
    responderError(
      res,
      err.status,
      err.codigo,
      err.message,
      err.detalle ? { detalle: err.detalle } : {},
    );
    return;
  }
  if (err instanceof ZodError) {
    const campos = err.issues.map((i) => ({
      campo: i.path.join('.'),
      mensaje: i.message,
    }));
    responderError(res, 400, 'datos_invalidos', 'Revisá los datos enviados.', { campos });
    return;
  }
  const status = Number(err?.status);
  if (status >= 400 && status < 500) {
    const codigo = CODIGOS_4XX[status] ?? 'solicitud_invalida';
    responderError(res, status, codigo, 'La solicitud no es válida.');
    return;
  }
  (req.log ?? logger).error({ err }, 'Error no controlado');
  responderError(res, 500, 'error_interno', 'Algo salió mal. Probá de nuevo en un rato.');
};
