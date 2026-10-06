import sharp from 'sharp';
import { logger } from '../logger.js';
import { archivoInvalido, MAX_PIXELES } from './validarImagen.js';
import { conTurno } from './turnoProcesamiento.js';

// Sin caché de libvips: cada imagen se procesa una vez y no tiene sentido guardarla en RAM.
sharp.cache(false);

// Errores de la IMAGEN (corrupta, truncada, demasiado grande) → 400 al cliente.
// Cualquier otro error es del servidor y sigue de largo como 500.
const ES_ERROR_DE_ENTRADA =
  /input|corrupt|pixel limit|premature|truncated|vips(jpeg|png)|load|bad/i;

// Reprocesar a WebP elimina EXIF (GPS del celular, etc.) y cualquier contenido
// escondido: del archivo original no se guarda ni un byte. Un tamaño por vez.
export function aWebp(datos: Buffer, lados: readonly number[]): Promise<Buffer[]> {
  return conTurno(async () => {
    const salidas: Buffer[] = [];
    try {
      for (const lado of lados) {
        const salida = await sharp(datos, { limitInputPixels: MAX_PIXELES })
          .rotate() // respeta la orientación de la foto del celular antes de perder el EXIF
          .resize({ width: lado, height: lado, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();
        salidas.push(salida);
      }
    } catch (err) {
      return errorDeImagen(err);
    }
    return salidas;
  });
}

// Traduce un error de sharp: si es de la imagen, 400; si no, sigue como 500.
export function errorDeImagen(err: unknown): never {
  if (!(err instanceof Error) || !ES_ERROR_DE_ENTRADA.test(err.message)) throw err;
  logger.warn({ err }, 'No se pudo procesar una imagen subida');
  throw archivoInvalido();
}
