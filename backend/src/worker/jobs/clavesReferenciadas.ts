import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { nombreBucket, type TipoBucket } from '../../shared/archivos/buckets.js';
import { s3 } from '../../shared/archivos/clienteS3.js';
import { db } from '../../shared/db/db.js';

// "tiendas/1/productos/7/uuid-1200.webp" → "tiendas/1/productos/7/uuid".
// Se compara por base y no por tamaño: si mañana cambian los tamaños, las
// fotos viejas siguen contando como usadas.
export const baseDeClave = (clave: string) => clave.replace(/-\d+\.webp$/, '');

// Qué claves de cada bucket usa todavía la base de datos.
export async function clavesReferenciadas(bucket: TipoBucket) {
  if (bucket === 'privado') {
    // total = TODAS las filas de comprobantes (aunque ya no tengan archivo): que
    // no quede ninguno con archivo es normal y no tiene que activar el freno.
    const filas = await db.selectFrom('comprobantes').select('archivoClave').execute();
    const usadas = new Set(
      filas.filter((f) => f.archivoClave).map((f) => f.archivoClave!),
    );
    return { total: filas.length, enUso: (c: string) => usadas.has(c) };
  }
  const fotos = await db.selectFrom('productoFotos').select('clave').execute();
  const logos = await db
    .selectFrom('tiendas')
    .select('logoClave')
    .where('logoClave', 'is not', null)
    .execute();
  const bases = new Set(fotos.map((f) => f.clave));
  const logosUsados = new Set(logos.map((l) => l.logoClave!));
  return {
    total: bases.size + logosUsados.size,
    enUso: (c: string) => logosUsados.has(c) || bases.has(baseDeClave(c)),
  };
}

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
