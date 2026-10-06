import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { pedidosRepo } from '../../pedidos/repositorios/pedidos.repository.js';
import { comprobantesRepo } from '../repositorios/comprobantes.repository.js';

// Bloquea el pedido y trae el comprobante, solo si está esperando revisión.
export async function pendienteDeRevision(
  tx: Ejecutor,
  tiendaId: TiendaId,
  pedidoId: number,
  id: number,
) {
  const pedido = await pedidosRepo.bloquear(tx, tiendaId, pedidoId);
  const comprobante =
    pedido && (await comprobantesRepo.buscar(tiendaId, pedidoId, id, tx));
  if (!pedido || !comprobante)
    throw new AppError(
      404,
      'comprobante_no_encontrado',
      'No encontramos ese comprobante.',
    );
  if (comprobante.estado !== 'pendiente' || pedido.estado !== 'comprobante_enviado') {
    throw new AppError(
      409,
      'comprobante_ya_revisado',
      'Ese comprobante ya fue revisado.',
    );
  }
  return { pedido, comprobante };
}
