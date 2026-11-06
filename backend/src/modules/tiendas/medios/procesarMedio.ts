import sharp from 'sharp';
import { aWebp, errorDeImagen } from '../../../shared/archivos/procesarImagen.js';
import { conTurno } from '../../../shared/archivos/turnoProcesamiento.js';
import { MAX_PIXELES } from '../../../shared/archivos/validarImagen.js';
import type { InfoMedio } from './validarMedio.js';

export const LADOS_FOTO = [1600, 800] as const;
export const LADO_ANIMADO = 1000;

// Archivos de un medio, a partir de su base.
export const archivosDeMedio = (base: string, tipo: 'foto' | 'animado') =>
  tipo === 'foto'
    ? LADOS_FOTO.map((l) => `${base}-${l}.webp`)
    : [`${base}-${LADO_ANIMADO}.webp`];

// Reprocesa todo (nunca se guarda el original): fotos a WebP de 1600 y 800 px;
// un GIF animado a WebP animado de hasta 1000 px, que pesa mucho menos.
export async function procesarMedio(datos: Buffer, info: InfoMedio): Promise<Buffer[]> {
  if (!info.animado) return aWebp(datos, LADOS_FOTO);
  return conTurno(async () => {
    try {
      const salida = await sharp(datos, { animated: true, limitInputPixels: MAX_PIXELES })
        .resize({
          width: LADO_ANIMADO,
          height: LADO_ANIMADO,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 72, effort: 4 })
        .toBuffer();
      return [salida];
    } catch (err) {
      return errorDeImagen(err);
    }
  });
}
