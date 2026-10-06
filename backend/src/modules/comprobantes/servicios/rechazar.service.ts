import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { tiendaParaPedido } from '../../pedidos/repositorios/tiendaParaPedido.repository.js';
import { cancelarEnTx } from '../../pedidos/servicios/cancelar.js';
import { verPedido } from '../../pedidos/servicios/panelPedidos.service.js';
import { comprobantesRepo } from '../repositorios/comprobantes.repository.js';
import { pendienteDeRevision } from './pendienteDeRevision.js';

const HORA_MS = 60 * 60 * 1000;
const MAX_RECHAZOS = 2;

// Rechazo con motivo obligatorio (6.1): la primera vez vuelve a pendiente de
// pago con el plazo reiniciado; la segunda, el pedido se cancela.
// El archivo rechazado se borra a las 48 h (decisión 33).
export async function rechazarComprobante(
  tiendaId: TiendaId,
  pedidoId: number,
  id: number,
  usuarioId: number,
  motivo: string,
) {
  const t = await tiendaParaPedido(tiendaId);
  const resultado = await db.transaction().execute(async (tx) => {
    const { pedido } = await pendienteDeRevision(tx, tiendaId, pedidoId, id);
    const ahora = new Date();
    await comprobantesRepo.actualizar(tx, tiendaId, id, {
      estado: 'rechazado',
      motivoRechazo: motivo,
      revisadoPor: usuarioId,
      rechazadoEn: ahora,
      archivoBorrarEn: new Date(ahora.getTime() + 48 * HORA_MS),
    });
    const rechazos = pedido.rechazos + 1;
    await tx
      .updateTable('pedidos')
      .set({ rechazos })
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', pedidoId)
      .execute();
    if (rechazos >= MAX_RECHAZOS) {
      await cancelarEnTx(
        tx,
        tiendaId,
        pedido,
        `Segundo comprobante rechazado: ${motivo}`.slice(0, 200),
      );
      return { cancelado: true };
    }
    const plazo =
      (pedido.tipo === 'inmediato' ? t.plazoComprobanteHoras : t.plazoSenaHoras) *
      HORA_MS;
    await tx
      .updateTable('pedidos')
      .set({
        estado: 'pendiente_pago',
        venceComprobanteEn: new Date(ahora.getTime() + plazo),
      })
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', pedidoId)
      .execute();
    return { cancelado: false };
  });
  return { ...(await verPedido(tiendaId, pedidoId)), ...resultado };
}
