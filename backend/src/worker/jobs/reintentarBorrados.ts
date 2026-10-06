import { borrarClaves } from '../../shared/archivos/borrarClaves.js';
import { nombreBucket, type TipoBucket } from '../../shared/archivos/buckets.js';
import { db } from '../../shared/db/db.js';
import { logger } from '../../shared/logger.js';

const LOTE = 100;
export const MAX_INTENTOS = 10;
const MINUTO = 60 * 1000;

type Pendiente = { id: number; bucket: TipoBucket; clave: string; intentos: number };

async function reprogramar(p: Pendiente, error: string, ahora: Date) {
  if (p.intentos + 1 >= MAX_INTENTOS) {
    logger.error(
      { bucket: p.bucket, clave: p.clave, error },
      'Archivo sin poder borrar tras todos los reintentos',
    );
  }
  // Espera creciente: 1, 2, 4, 8… minutos entre intentos.
  const reintentarEn = new Date(ahora.getTime() + 2 ** p.intentos * MINUTO);
  await db
    .updateTable('archivosPorBorrar')
    .set({ intentos: p.intentos + 1, reintentarEn, ultimoError: error })
    .where('id', '=', p.id)
    .execute();
}

// Job: reintenta los borrados que fallaron, cada uno en SU bucket. Idempotente:
// borrar una clave que ya no existe en S3 cuenta como éxito.
export async function reintentarBorrados(ahora = new Date()) {
  const pendientes: Pendiente[] = await db
    .selectFrom('archivosPorBorrar')
    .select(['id', 'bucket', 'clave', 'intentos'])
    .where('reintentarEn', '<=', ahora)
    .where('intentos', '<', MAX_INTENTOS)
    .orderBy('id')
    .limit(LOTE)
    .execute();
  let borrados = 0;
  let fallidos = 0;
  for (const bucket of ['publico', 'privado'] as const) {
    const delBucket = pendientes.filter((p) => p.bucket === bucket);
    if (delBucket.length === 0) continue;
    const fallos = new Map(
      (
        await borrarClaves(
          delBucket.map((p) => p.clave),
          nombreBucket(bucket),
        )
      ).map((f) => [f.clave, f.error]),
    );
    const ok = delBucket.filter((p) => !fallos.has(p.clave)).map((p) => p.id);
    if (ok.length)
      await db.deleteFrom('archivosPorBorrar').where('id', 'in', ok).execute();
    for (const p of delBucket.filter((x) => fallos.has(x.clave)))
      await reprogramar(p, fallos.get(p.clave)!, ahora);
    borrados += ok.length;
    fallidos += fallos.size;
  }
  return { borrados, fallidos };
}
