import { PutObjectCommand } from '@aws-sdk/client-s3';
import { config } from '../../config/env.js';
import type { TiendaId } from '../db/tiendaId.js';
import { logger } from '../logger.js';
import { borrarConCola } from './borrarConCola.js';
import { prefijoTienda } from './claves.js';
import { s3 } from './clienteS3.js';

// Bucket público: solo WebP ya reprocesados (fotos y logos).
export async function subirWebp(clave: string, datos: Buffer): Promise<void> {
  await s3.send(
    new PutObjectCommand({
      Bucket: config.S3_BUCKET_PUBLICO,
      Key: clave,
      Body: datos,
      ContentType: 'image/webp',
      // Las claves llevan un UUID: el contenido de una clave nunca cambia.
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );
}

// Solo borra claves de ESA tienda. Lo que S3 no pudo borrar queda en la cola
// archivos_por_borrar y el worker lo reintenta: nunca se pierde de vista.
export async function borrarPublicos(
  tiendaId: TiendaId,
  claves: string[],
): Promise<void> {
  const propias = claves.filter((c) => c.startsWith(prefijoTienda(tiendaId)));
  if (propias.length !== claves.length) {
    logger.error(
      { tiendaId, claves },
      'Se intentó borrar claves de otra tienda: descartadas',
    );
  }
  if (propias.length) await borrarConCola(propias, 'publico');
}

export const urlPublica = (clave: string) => `${config.S3_URL_PUBLICA}/${clave}`;
