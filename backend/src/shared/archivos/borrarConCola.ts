import { logger } from '../logger.js';
import { borrarClaves } from './borrarClaves.js';
import { nombreBucket, type TipoBucket } from './buckets.js';
import { encolarBorrado } from './colaBorrado.js';

// Borra y, lo que S3 no pudo borrar, lo deja en la cola para el worker.
// Nunca tira error: el que llama ya está manejando otro problema (o terminó bien).
export async function borrarConCola(claves: string[], bucket: TipoBucket): Promise<void> {
  try {
    const fallos = await borrarClaves(claves, nombreBucket(bucket));
    if (fallos.length === 0) return;
    logger.warn(
      { bucket, fallos },
      'S3 no borró algunos archivos: quedan en la cola para reintentar',
    );
    await encolarBorrado(fallos, bucket);
  } catch (err) {
    logger.error(
      { err, bucket, claves },
      'No se pudo borrar ni encolar: lo levanta el barrido de huérfanos',
    );
  }
}
