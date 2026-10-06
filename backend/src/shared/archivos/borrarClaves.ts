import { DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { config } from '../../config/env.js';
import { logger } from '../logger.js';
import { s3 } from './clienteS3.js';

export type FalloBorrado = { clave: string; error: string };
const LOTE_S3 = 1000; // máximo de claves por DeleteObjects en S3/R2

const fallanTodas = (claves: string[], error: string) =>
  claves.map((clave) => ({ clave, error: error.slice(0, 255) }));

async function borrarLote(claves: string[], bucket: string): Promise<FalloBorrado[]> {
  try {
    const Objects = claves.map((Key) => ({ Key }));
    const r = await s3.send(
      new DeleteObjectsCommand({ Bucket: bucket, Delete: { Objects } }),
    );
    const errores = r.Errors ?? [];
    // Un error sin clave no se puede atribuir: se toma todo el lote como fallido.
    if (errores.some((e) => !e.Key))
      return fallanTodas(claves, 'S3 informó un error sin clave');
    return errores.map((e) => ({
      clave: e.Key!,
      error: `${e.Code}: ${e.Message}`.slice(0, 255),
    }));
  } catch (err) {
    // Error de toda la llamada (red, credenciales, bucket): se loguea fuerte.
    logger.error({ err, bucket }, 'Falló DeleteObjects');
    return fallanTodas(claves, err instanceof Error ? err.message : String(err));
  }
}

// Borra claves de un bucket (por defecto el público) y devuelve las que fallaron.
// Bajo nivel: no controla de qué tienda son. Usar borrarPublicos o los jobs.
export async function borrarClaves(
  claves: string[],
  bucket = config.S3_BUCKET_PUBLICO,
): Promise<FalloBorrado[]> {
  const fallos: FalloBorrado[] = [];
  for (let i = 0; i < claves.length; i += LOTE_S3)
    fallos.push(...(await borrarLote(claves.slice(i, i + LOTE_S3), bucket)));
  return fallos;
}
