import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { nombreBucket, type TipoBucket } from '../../shared/archivos/buckets.js';
import { s3 } from '../../shared/archivos/clienteS3.js';

// Claves bajo tiendas/ subidas antes de `limite` (recorre todas las páginas).
export async function clavesAnterioresA(
  bucket: TipoBucket,
  limite: Date,
): Promise<string[]> {
  const claves: string[] = [];
  let token: string | undefined;
  do {
    const r = await s3.send(
      new ListObjectsV2Command({
        Bucket: nombreBucket(bucket),
        Prefix: 'tiendas/',
        ContinuationToken: token,
      }),
    );
    for (const o of r.Contents ?? [])
      if (o.Key && o.LastModified && o.LastModified < limite) claves.push(o.Key);
    token = r.IsTruncated ? r.NextContinuationToken : undefined;
  } while (token);
  return claves;
}
