import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { pedidosRepo } from '../repositorios/pedidos.repository.js';
import { tiendaParaPedido } from '../repositorios/tiendaParaPedido.repository.js';
import { pedidoNoEncontrado, verPedido } from './panelPedidos.service.js';

const HORA_MS = 60 * 60 * 1000;

// Encargos 2: el comerciante acepta un encargo "por aceptar". Con seña pasa a
// esperar el pago y recién ahí arranca el plazo; sin seña queda confirmado.
// Rechazarlo es cancelarlo con motivo (cancelarPedido.service.ts).
export async function aceptarEncargo(tiendaId: TiendaId, id: number, ahora = new Date()) {
  const { plazoSenaHoras } = await tiendaParaPedido(tiendaId);
  await db.transaction().execute(async (tx) => {
    const p = await pedidosRepo.bloquear(tx, tiendaId, id);
    if (!p) throw pedidoNoEncontrado();
    if (p.tipo !== 'encargo' || p.estado !== 'pendiente_confirmacion')
      throw new AppError(
        409,
        'encargo_no_por_aceptar',
        'Ese pedido no es un encargo esperando que lo aceptes.',
      );
    const conSena = p.sena > 0;
    await tx
      .updateTable('pedidos')
      .set({
        estado: conSena ? 'pendiente_pago' : 'confirmado',
        venceComprobanteEn: conSena
          ? new Date(ahora.getTime() + plazoSenaHoras * HORA_MS)
          : null,
      })
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', id)
      .execute();
  });
  return verPedido(tiendaId, id);
}
