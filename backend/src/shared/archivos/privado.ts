import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '../../config/env.js';
import { s3 } from './clienteS3.js';

export const VIGENCIA_URL_S = 5 * 60;

// Bucket PRIVADO (comprobantes): sin acceso público, nunca con cache.
export async function subirPrivado(
  clave: string,
  datos: Buffer,
  tipo: string,
): Promise<void> {
  await s3.send(
    new PutObjectCommand({
      Bucket: config.S3_BUCKET_PRIVADO,
      Key: clave,
      Body: datos,
      ContentType: tipo,
      CacheControl: 'private, no-store',
    }),
  );
}

// URL firmada de 5 minutos (sección 7). Se fuerza la descarga ("attachment")
// para que un PDF nunca se abra como página dentro de nuestro dominio.
export function urlFirmada(clave: string, nombreDescarga: string): Promise<string> {
  return getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: config.S3_BUCKET_PRIVADO,
      Key: clave,
      ResponseContentDisposition: `attachment; filename="${nombreDescarga.replace(/[^\w.-]/g, '_')}"`,
    }),
    { expiresIn: VIGENCIA_URL_S },
  );
}
