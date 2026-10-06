import { AppError } from '../errors/AppError.js';
import { aWebp } from './procesarImagen.js';
import { validarImagen } from './validarImagen.js';

const LADO_COMPROBANTE = 2000; // grande para que se lean bien los números
const FIRMA_PDF = Buffer.from('%PDF-');

export type ComprobanteProcesado = {
  datos: Buffer;
  tipoOriginal: 'jpg' | 'png' | 'pdf';
  contentType: string;
  extension: string;
};

const invalido = () =>
  new AppError(
    400,
    'archivo_invalido',
    'Subí el comprobante en JPG, PNG o PDF (máximo 5 MB).',
  );

// Por contenido, nunca por extensión (sección 7). Las imágenes se reprocesan a
// WebP (sin metadatos ni contenido escondido). Los PDF se guardan tal cual en
// el bucket PRIVADO y solo se sirven como descarga con URL firmada.
export async function procesarComprobante(
  archivo: Buffer,
): Promise<ComprobanteProcesado> {
  if (archivo.subarray(0, FIRMA_PDF.length).equals(FIRMA_PDF)) {
    if (!archivo.subarray(-1024).includes('%%EOF')) throw invalido();
    return {
      datos: archivo,
      tipoOriginal: 'pdf',
      contentType: 'application/pdf',
      extension: 'pdf',
    };
  }
  await validarImagen(archivo);
  const tipoOriginal = archivo[0] === 0xff ? 'jpg' : 'png';
  const [datos] = await aWebp(archivo, [LADO_COMPROBANTE]);
  return { datos: datos!, tipoOriginal, contentType: 'image/webp', extension: 'webp' };
}
