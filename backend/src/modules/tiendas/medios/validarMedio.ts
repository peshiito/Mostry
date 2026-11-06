import sharp, { type Metadata } from 'sharp';
import { AppError } from '../../../shared/errors/AppError.js';
import { MAX_PIXELES } from '../../../shared/archivos/validarImagen.js';

const FIRMAS = [
  { formato: 'jpeg', bytes: [0xff, 0xd8, 0xff] },
  { formato: 'png', bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { formato: 'gif', bytes: [0x47, 0x49, 0x46, 0x38] }, // "GIF8"
] as const;

// Un GIF no puede tener más de 300 cuadros ni más de 60 MP en total (frena las
// "bombas" que pesan poco y se inflan al decodificar).
export const MAX_CUADROS = 300;
const MAX_PIXELES_ANIMADO = 60_000_000;

export const medioInvalido = () =>
  new AppError(400, 'archivo_invalido', 'Subí una imagen JPG, PNG o GIF (máximo 8 MB).');

export type InfoMedio = { animado: boolean; ancho: number; alto: number };

// Decide por el CONTENIDO (magic bytes) y por lo que dice la cabecera.
export async function validarMedio(datos: Buffer): Promise<InfoMedio> {
  const firma = FIRMAS.find((f) => f.bytes.every((b, i) => datos[i] === b));
  if (!firma) throw medioInvalido();
  let meta: Metadata;
  try {
    meta = await sharp(datos, { animated: true, limitInputPixels: false }).metadata();
  } catch {
    throw medioInvalido();
  }
  const cuadros = meta.pages ?? 1;
  const ancho = meta.width ?? 0;
  const alto = meta.pageHeight ?? meta.height ?? 0;
  const pixeles = ancho * alto;
  if (meta.format !== firma.formato || pixeles === 0 || pixeles > MAX_PIXELES)
    throw medioInvalido();
  if (cuadros > MAX_CUADROS || pixeles * cuadros > MAX_PIXELES_ANIMADO)
    throw new AppError(
      400,
      'gif_grande',
      'Ese GIF es muy largo o muy grande. Probá con uno más corto.',
    );
  return { animado: firma.formato === 'gif' && cuadros > 1, ancho, alto };
}
