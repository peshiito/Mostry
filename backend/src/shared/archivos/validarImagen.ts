import sharp, { type Metadata } from 'sharp';
import { AppError } from '../errors/AppError.js';
import { logger } from '../logger.js';

const FIRMAS = [
  { formato: 'jpeg', bytes: [0xff, 0xd8, 0xff] },
  { formato: 'png', bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
] as const;

// Tope de píxeles (24 MP ≈ 6000×4000, más que cualquier foto de celular):
// frena "bombas" de descompresión antes de decodificar nada.
export const MAX_PIXELES = 24_000_000;

export const archivoInvalido = () =>
  new AppError(400, 'archivo_invalido', 'Subí una imagen JPG o PNG (máximo 5 MB).');

// Decide por el CONTENIDO (magic bytes), nunca por la extensión ni el Content-Type.
// Después libvips lee la cabecera: formato real y tamaño declarado.
export async function validarImagen(datos: Buffer): Promise<void> {
  const firma = FIRMAS.find((f) => f.bytes.every((b, i) => datos[i] === b));
  if (!firma) throw archivoInvalido();

  let meta: Metadata;
  try {
    meta = await sharp(datos, { limitInputPixels: false }).metadata();
  } catch (err) {
    logger.debug({ err }, 'Cabecera de imagen ilegible');
    throw archivoInvalido();
  }
  const pixeles = (meta.width ?? 0) * (meta.height ?? 0);
  if (meta.format !== firma.formato || pixeles === 0 || pixeles > MAX_PIXELES)
    throw archivoInvalido();
}
