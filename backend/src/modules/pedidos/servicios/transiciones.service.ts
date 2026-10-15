import type { Medio } from '../../../shared/db/tipos/caja.js';
import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import type { EstadoPedido } from '../../../shared/db/tipos/pedidos.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { pedidosRepo, type Pedido } from '../repositorios/pedidos.repository.js';
import { stockRepo } from '../repositorios/stock.repository.js';
import { alEntregar } from './alEntregar.js';
import { TRANSICIONES_MANUALES, type EstadoManual } from './estados.js';
import { pedidoNoEncontrado, verPedido } from './panelPedidos.service.js';

const invalida = (desde: EstadoPedido, hacia: EstadoPedido) =>
  new AppError(
    409,
    'transicion_invalida',
    'El pedido no puede pasar a ese estado ahora.',
    { desde, hacia },
  );

function validar(p: Pedido, hacia: EstadoManual) {
  if (!TRANSICIONES_MANUALES[hacia].includes(p.estado)) throw invalida(p.estado, hacia);
  if (
    (hacia === 'en_camino' && p.entrega !== 'envio') ||
    (hacia === 'listo_retirar' && p.entrega !== 'retiro')
  ) {
    throw invalida(p.estado, hacia);
  }
}

// El comerciante avanza el pedido un paso (con el pedido bloqueado: sin carreras).
// Al entregar: el resto del encargo y el sello del Club (alEntregar.ts).
export async function avanzarPedido(
  tiendaId: TiendaId,
  id: number,
  hacia: EstadoManual,
  medioCobro?: Medio,
) {
  await db.transaction().execute(async (tx) => {
    const p = await pedidosRepo.bloquear(tx, tiendaId, id);
    if (!p) throw pedidoNoEncontrado();
    validar(p, hacia);
    if (hacia === 'entregado') await alEntregar(tx, tiendaId, p, medioCobro);
    // Un pedido inmediato gratis (premio del Club) no pasa por el pago: al
    // confirmarlo, la reserva pasa a ser stock vendido, como al aprobar un pago.
    if (hacia === 'confirmado' && p.tipo === 'inmediato')
      await stockRepo.descontar(
        tx,
        tiendaId,
        await pedidosRepo.itemsDeStock(tiendaId, id, tx),
      );
    await tx
      .updateTable('pedidos')
      .set({ estado: hacia, ...(hacia === 'entregado' && { entregadoEn: new Date() }) })
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', id)
      .execute();
  });
  return verPedido(tiendaId, id);
}
