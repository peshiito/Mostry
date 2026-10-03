import type { RequestHandler } from 'express';
import { responderError } from '../http/respuestaError.js';

export const rutaNoEncontrada: RequestHandler = (_req, res) => {
  responderError(res, 404, 'ruta_no_encontrada', 'No encontramos lo que buscás.');
};
