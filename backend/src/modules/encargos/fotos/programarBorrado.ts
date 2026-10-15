import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';

const ESPERA_MS = 7 * 24 * 60 * 60 * 1000;

// Encargos 2: al cerrar un pedido (entregado o cancelado), sus fotos de
// referencia se borran a los 7 días (el job borrar-fotos-referencia).
export const programarBorradoFotos = (
  tx: Ejecutor,
  tiendaId: TiendaId,
  pedidoId: number,
) =>
  tx
    .updateTable('pedidoItems')
    .set({ fotoBorrarEn: new Date(Date.now() + ESPERA_MS) })
    .where('tiendaId', '=', tiendaId)
    .where('pedidoId', '=', pedidoId)
    .where('fotoClave', 'is not', null)
    .execute();
