import { sql } from 'kysely';
import { db } from '../db/db.js';
import type { FalloBorrado } from './borrarClaves.js';
import type { TipoBucket } from './buckets.js';

// Anota claves para reintentar. Si ya estaban, solo se actualiza el error: los
// intentos NO vuelven a cero (si no, una clave rota nunca llegaría al tope ni
// al log de alerta de reintentarBorrados).
export async function encolarBorrado(
  fallos: FalloBorrado[],
  bucket: TipoBucket = 'publico',
): Promise<void> {
  if (fallos.length === 0) return;
  await db
    .insertInto('archivosPorBorrar')
    .values(fallos.map((f) => ({ bucket, clave: f.clave, ultimoError: f.error })))
    .onDuplicateKeyUpdate({ ultimoError: sql`VALUES(ultimo_error)` })
    .execute();
}

// Ya no hace falta reintentar estas claves (se borraron por otro camino).
export async function quitarDeCola(
  claves: string[],
  bucket: TipoBucket = 'publico',
): Promise<void> {
  if (claves.length) {
    await db
      .deleteFrom('archivosPorBorrar')
      .where('bucket', '=', bucket)
      .where('clave', 'in', claves)
      .execute();
  }
}
