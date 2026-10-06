import { borrarClaves } from '../../shared/archivos/borrarClaves.js';
import { nombreBucket } from '../../shared/archivos/buckets.js';
import { db } from '../../shared/db/db.js';
import { logger } from '../../shared/logger.js';

const LOTE = 200;

// Job (cada 15 min): borra del bucket privado los comprobantes cuyo
// archivo_borrar_en ya pasó (2 h tras aprobar, 48 h tras rechazar o cancelar,
// 30 días como máximo). Los datos del pago quedan; solo se va la imagen.
// Si S3 falla, la fila sigue pendiente y el próximo turno lo reintenta.
export async function borrarComprobantesVencidos(ahora = new Date()) {
  const vencidos = await db
    .selectFrom('comprobantes')
    .select(['id', 'archivoClave'])
    .where('archivoBorrarEn', '<=', ahora)
    .where('archivoClave', 'is not', null)
    .orderBy('archivoBorrarEn')
    .limit(LOTE)
    .execute();
  if (vencidos.length === 0) return { borrados: 0, fallidos: 0 };
  const fallos = await borrarClaves(
    vencidos.map((c) => c.archivoClave!),
    nombreBucket('privado'),
  );
  const fallidas = new Set(fallos.map((f) => f.clave));
  const ok = vencidos.filter((c) => !fallidas.has(c.archivoClave!)).map((c) => c.id);
  if (ok.length) {
    await db
      .updateTable('comprobantes')
      .set({ archivoClave: null, archivoBorradoEn: ahora })
      .where('id', 'in', ok)
      .execute();
  }
  if (fallos.length) {
    // Se corren 1 h para no trabar la cola: los que fallan siempre no tapan a los nuevos.
    const ids = vencidos.filter((c) => fallidas.has(c.archivoClave!)).map((c) => c.id);
    await db
      .updateTable('comprobantes')
      .set({ archivoBorrarEn: new Date(ahora.getTime() + 3_600_000) })
      .where('id', 'in', ids)
      .execute();
    logger.error({ fallos }, 'Comprobantes sin poder borrar: se reintentan en 1 h');
  }
  return { borrados: ok.length, fallidos: fallos.length };
}
