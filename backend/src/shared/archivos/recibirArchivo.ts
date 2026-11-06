import type { RequestHandler } from 'express';
import multer from 'multer';
import { AppError } from '../errors/AppError.js';

const MB = 1024 * 1024;

const subida = (maxMb: number) =>
  multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxMb * MB, files: 1, fields: 0, parts: 1 },
  });

function traducirError(err: unknown, campo: string, maxMb: number): AppError | unknown {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE')
      return new AppError(413, 'archivo_grande', `El archivo pesa más de ${maxMb} MB.`);
    return new AppError(
      400,
      'archivo_invalido',
      `Mandá un solo archivo, en el campo "${campo}".`,
    );
  }
  // busboy: multipart mal armado o cortado. Es un error del cliente, no un 500.
  if (err instanceof Error && !('status' in err)) {
    return new AppError(
      400,
      'archivo_invalido',
      'El archivo llegó incompleto. Probá de nuevo.',
    );
  }
  return err;
}

// Un solo archivo en el campo indicado, en memoria (nunca toca el disco).
export function recibirArchivo(campo: string, maxMb = 5): RequestHandler {
  const procesar = subida(maxMb).single(campo);
  return (req, res, next) => {
    procesar(req, res, (err: unknown) => {
      if (err) return next(traducirError(err, campo, maxMb));
      if (!req.file)
        return next(new AppError(400, 'archivo_faltante', 'No llegó ningún archivo.'));
      next();
    });
  };
}
