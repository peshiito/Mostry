import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { registrarMovimiento } from '../../caja/servicios/registrarMovimiento.js';
import { pedidosRepo } from '../../pedidos/repositorios/pedidos.repository.js';
import { stockRepo } from '../../pedidos/repositorios/stock.repository.js';
import { montoAPagar } from '../../pedidos/servicios/montos.js';
import { verPedido } from '../../pedidos/servicios/panelPedidos.service.js';
import type { DatosAprobacion } from '../schemas.js';
import { marcarAprobado } from './marcarAprobado.js';
import { pendienteDeRevision } from './pendienteDeRevision.js';

// Aprobación (CLAUDE.md 6.1): datos del pago guardados, stock real descontado
// y reserva liberada, ingreso en caja con la fecha de la operación (6.4) y la
// imagen se borra en 2 h. Todo o nada.
// El monto tiene que ser el pedido: si el comprador pagó otra cosa, se rechaza
// con el motivo (así la caja siempre cierra con el total del pedido).
export async function aprobarComprobante(
  tiendaId: TiendaId,
  pedidoId: number,
  id: number,
  usuarioId: number,
  d: DatosAprobacion,
) {
  await db.transaction().execute(async (tx) => {
    const { pedido } = await pendienteDeRevision(tx, tiendaId, pedidoId, id);
    const esperado = montoAPagar(pedido);
    if (d.monto !== esperado) {
      throw new AppError(
        409,
        'monto_no_coincide',
        'El monto no coincide con el pedido. Si pagó otra cosa, rechazalo con el motivo.',
        { esperado },
      );
    }
    await marcarAprobado(tx, tiendaId, id, usuarioId, d);
    if (pedido.tipo === 'inmediato') {
      await stockRepo.descontar(
        tx,
        tiendaId,
        await pedidosRepo.items(tiendaId, pedidoId, tx),
      );
    }
    await tx
      .updateTable('pedidos')
      .set({ estado: 'pago_aprobado' })
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', pedidoId)
      .execute();
    const concepto =
      pedido.tipo === 'encargo'
        ? `Seña del encargo #${pedido.numero}`
        : `Pago del pedido #${pedido.numero}`;
    const movimiento = {
      tipo: 'ingreso',
      medio: 'transferencia',
      monto: d.monto,
      concepto,
      origen: 'pedido',
      origenId: pedidoId,
      fecha: d.fechaOperacion,
    } as const;
    await registrarMovimiento(tx, tiendaId, movimiento);
  });
  return verPedido(tiendaId, pedidoId);
}
