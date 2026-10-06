import { DeleteObjectsCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { config } from '../config/env.js';
import { s3 } from '../shared/archivos/clienteS3.js';

async function claves(bucket: string, prefijo: string): Promise<string[]> {
  const r = await s3.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: prefijo }));
  return (r.Contents ?? []).map((o) => o.Key!).sort();
}

// Claves en los buckets de test bajo un prefijo (para detectar huérfanos).
export const objetosBajo = (prefijo: string) => claves(config.S3_BUCKET_PUBLICO, prefijo);
export const privadosBajo = (prefijo: string) =>
  claves(config.S3_BUCKET_PRIVADO, prefijo);

async function vaciar(bucket: string) {
  if (!bucket.endsWith('-test'))
    throw new Error(`Me niego a vaciar "${bucket}": no es un bucket de test`);
  const Objects = (await claves(bucket, '')).map((Key) => ({ Key }));
  if (Objects.length)
    await s3.send(new DeleteObjectsCommand({ Bucket: bucket, Delete: { Objects } }));
}

// Vacía los buckets de test (público y privado). Se niega a tocar cualquier
// bucket que no termine en -test.
export async function vaciarBucketDeTest(): Promise<void> {
  await Promise.all([vaciar(config.S3_BUCKET_PUBLICO), vaciar(config.S3_BUCKET_PRIVADO)]);
}
