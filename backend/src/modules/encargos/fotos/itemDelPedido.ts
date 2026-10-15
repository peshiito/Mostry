import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';

export const itemNoEncontrado = () =>
  new AppError(404, 'item_no_encontrado', 'No encontramos ese producto del pedido.');

// Un ítem de UN pedido de UNA tienda (nunca solo por id: sin IDOR).
export const itemDelPedido = (
  tiendaId: TiendaId,
  pedidoId: number,
  itemId: number,
  ej: Ejecutor = db,
) =>
  ej
    .selectFrom('pedidoItems')
    .select(['id', 'personalizacion', 'fotoClave'])
    .where('tiendaId', '=', tiendaId)
    .where('pedidoId', '=', pedidoId)
    .where('id', '=', itemId)
    .executeTakeFirst();
