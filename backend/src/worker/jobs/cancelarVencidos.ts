import { db } from '../../shared/db/db.js';
import { comoTiendaId } from '../../shared/db/tiendaId.js';
import { logger } from '../../shared/logger.js';
import { pedidosRepo } from '../../modules/pedidos/repositorios/pedidos.repository.js';
import { cancelarEnTx } from '../../modules/pedidos/servicios/cancelar.js';

const LOTE = 200;

// Job (cada 5 min): cancela los pedidos que no subieron el comprobante a tiempo
// y libera su reserva de stock (sección 6.6). Idempotente: cada pedido se
// re-chequea con lock, así que correrlo dos veces no hace nada de más.
export async function cancelarVencidos(ahora = new Date()) {
  const vencidos = await db
    .selectFrom('pedidos')
    .select(['id', 'tiendaId'])
    .where('estado', '=', 'pendiente_pago')
    .where('venceComprobanteEn', '<=', ahora)
    .orderBy('venceComprobanteEn')
    .limit(LOTE)
    .execute();
  let cancelados = 0;
  let fallidos = 0;
  for (const v of vencidos) {
    try {
      const hecho = await db.transaction().execute(async (tx) => {
        const p = await pedidosRepo.bloquear(tx, comoTiendaId(v.tiendaId), v.id);
        if (
          p?.estado !== 'pendiente_pago' ||
          !p.venceComprobanteEn ||
          p.venceComprobanteEn > ahora
        )
          return false;
        await cancelarEnTx(tx, comoTiendaId(v.tiendaId), p, 'Venció el plazo para pagar');
        return true;
      });
      if (hecho) cancelados++;
    } catch (err) {
      // Un pedido con problemas no frena a los demás.
      logger.error(
        { err, pedidoId: v.id, tiendaId: v.tiendaId },
        'No se pudo cancelar un pedido vencido',
      );
      fallidos++;
    }
  }
  return { revisados: vencidos.length, cancelados, fallidos };
}
