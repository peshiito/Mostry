import sharp from 'sharp';
import { errorDeImagen } from './procesarImagen.js';
import { conTurno } from './turnoProcesamiento.js';
import { MAX_PIXELES } from './validarImagen.js';

const TRANSPARENTE = { r: 0, g: 0, b: 0, alpha: 0 };

// Normaliza el logo para que todos se vean del mismo tamaño, sea redondo, cuadrado,
// apaisado, gigante o chiquito: recorta el borde vacío (blanco o transparente)
// y lo centra en un cuadrado transparente de `lado` px. Sale como WebP, sin metadatos.
export function logoAWebp(datos: Buffer, lado: number): Promise<Buffer> {
  return conTurno(async () => {
    try {
      // Con una imagen lisa (sin borde) trim() la deja igual: no hace falta plan B.
      const recortado = await sharp(datos, { limitInputPixels: MAX_PIXELES })
        .rotate()
        .trim({ threshold: 12 })
        .toBuffer();
      return await sharp(recortado)
        .resize({ width: lado, height: lado, fit: 'contain', background: TRANSPARENTE })
        .webp({ quality: 85 })
        .toBuffer();
    } catch (err) {
      return errorDeImagen(err);
    }
  });
}
