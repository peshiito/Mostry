import { borrarClaves } from '../../shared/archivos/borrarClaves.js';
import { nombreBucket } from '../../shared/archivos/buckets.js';
import { db } from '../../shared/db/db.js';
import { logger } from '../../shared/logger.js';

const LOTE = 200;

// Job (cada 15 min): borra del bucket privado las fotos de referencia de los
// encargos cuyo foto_borrar_en ya pasó (7 días tras cerrar el pedido, 60 como
// máximo). El texto de la personalización queda; solo se va la imagen.
// Si S3 falla, la fila sigue pendiente y se reintenta en 1 h.
export async function borrarFotosReferencia(ahora = new Date()) {
  const vencidas = await db
    .selectFrom('pedidoItems')
    .select(['id', 'fotoClave'])
    .where('fotoBorrarEn', '<=', ahora)
    .where('fotoClave', 'is not', null)
    .orderBy('fotoBorrarEn')
    .limit(LOTE)
    .execute();
  if (vencidas.length === 0) return { borrados: 0, fallidos: 0 };
  const fallos = await borrarClaves(
    vencidas.map((f) => f.fotoClave!),
    nombreBucket('privado'),
  );
  const fallidas = new Set(fallos.map((f) => f.clave));
  const ok = vencidas.filter((f) => !fallidas.has(f.fotoClave!)).map((f) => f.id);
  if (ok.length)
    await db
      .updateTable('pedidoItems')
      .set({ fotoClave: null, fotoBorrarEn: null })
      .where('id', 'in', ok)
      .execute();
  if (fallos.length) {
    const ids = vencidas.filter((f) => fallidas.has(f.fotoClave!)).map((f) => f.id);
    await db
      .updateTable('pedidoItems')
      .set({ fotoBorrarEn: new Date(ahora.getTime() + 3_600_000) })
      .where('id', 'in', ids)
      .execute();
    logger.error(
      { fallos },
      'Fotos de referencia sin poder borrar: se reintentan en 1 h',
    );
  }
  return { borrados: ok.length, fallidos: fallos.length };
}
