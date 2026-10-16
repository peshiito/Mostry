import { db } from '../../shared/db/db.js';
import { comoTiendaId } from '../../shared/db/tiendaId.js';
import { logger } from '../../shared/logger.js';
import { pedidosRepo } from '../../modules/pedidos/repositorios/pedidos.repository.js';
import { cancelarEnTx } from '../../modules/pedidos/servicios/cancelar.js';
import { candidatos, motivo } from '../../modules/pedidos/servicios/vencidos.js';

// Job (cada 5 min): cancela los pedidos que no pagaron a tiempo (y libera su
// reserva de stock, sección 6.6), los encargos que pasaron su fecha sin que
// los aceptaran y los pedidos gratis del Club que nadie confirmó.
// Idempotente: cada pedido se re-chequea con lock.
export async function cancelarVencidos(ahora = new Date()) {
  const vencidos = await candidatos(ahora);
  let cancelados = 0;
  let fallidos = 0;
  for (const v of vencidos) {
    const tiendaId = comoTiendaId(v.tiendaId);
    try {
      const hecho = await db.transaction().execute(async (tx) => {
        const p = await pedidosRepo.bloquear(tx, tiendaId, v.id);
        const porque = motivo(p, ahora, v.plazoComprobanteHoras);
        if (!p || !porque) return false;
        await cancelarEnTx(tx, tiendaId, p, porque);
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
