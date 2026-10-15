import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';

// El premio del Club que se usó en un pedido o una venta (null si ninguno o si
// se anuló). Para mostrarlo en el detalle, el seguimiento y el ticket.
export const premioUsado = (
  tiendaId: TiendaId,
  origen: 'pedido' | 'venta',
  origenId: number,
) =>
  db
    .selectFrom('canjes')
    .select(['compras', 'tipo', 'valor', 'tope', 'descripcion', 'descuento'])
    .where('tiendaId', '=', tiendaId)
    .where('origen', '=', origen)
    .where('origenId', '=', origenId)
    .where('anuladoEn', 'is', null)
    .executeTakeFirst()
    .then((c) => c ?? null);
