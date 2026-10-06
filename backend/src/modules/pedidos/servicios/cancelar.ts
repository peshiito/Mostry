import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import type { Pedido } from '../repositorios/pedidos.repository.js';
import { pedidosRepo } from '../repositorios/pedidos.repository.js';
import { stockRepo } from '../repositorios/stock.repository.js';
import { CON_RESERVA, CON_STOCK_DESCONTADO, ESTADOS_FINALES } from './estados.js';

// Cancela un pedido YA bloqueado (FOR UPDATE) dentro de una transacción.
// La usan el comerciante, el segundo rechazo de comprobante y el worker.
// Devuelve si el comprador ya había pagado (para ofrecer la devolución).
export async function cancelarEnTx(
  tx: Ejecutor,
  tiendaId: TiendaId,
  p: Pedido,
  motivo: string,
) {
  if (ESTADOS_FINALES.includes(p.estado)) {
    throw new AppError(
      409,
      'pedido_cerrado',
      'Ese pedido ya está entregado o cancelado.',
    );
  }
  if (p.tipo === 'inmediato') {
    const items = await pedidosRepo.items(tiendaId, p.id, tx);
    if (CON_RESERVA.includes(p.estado))
      await stockRepo.liberarReserva(tx, tiendaId, items);
    if (CON_STOCK_DESCONTADO.includes(p.estado))
      await stockRepo.devolver(tx, tiendaId, items);
  }
  await tx
    .updateTable('pedidos')
    .set({
      estado: 'cancelado',
      motivoCancelacion: motivo,
      canceladoEn: new Date(),
      venceComprobanteEn: null,
    })
    .where('tiendaId', '=', tiendaId)
    .where('id', '=', p.id)
    .execute();
  // Los comprobantes que quedaron sin revisar se borran a las 48 h (decisión 33),
  // aunque traigan la retención máxima de 30 días de la subida.
  await tx
    .updateTable('comprobantes')
    .set({ archivoBorrarEn: new Date(Date.now() + 48 * 60 * 60 * 1000) })
    .where('tiendaId', '=', tiendaId)
    .where('pedidoId', '=', p.id)
    .where('estado', '=', 'pendiente')
    .execute();
  // Pagado = llegó a pago aprobado (o más adelante) y había algo que pagar.
  const habiaPago =
    CON_STOCK_DESCONTADO.includes(p.estado) && (p.tipo === 'inmediato' || p.sena > 0);
  return { habiaPago };
}
