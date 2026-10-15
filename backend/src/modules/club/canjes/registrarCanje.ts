import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import type { CanjePreparado } from './prepararCanje.js';

type Origen = 'pedido' | 'venta';

// Después de crear el pedido o la venta: deja el canje anotado.
export const registrarCanje = (
  tx: Ejecutor,
  tiendaId: TiendaId,
  c: CanjePreparado,
  origen: Origen,
  origenId: number,
) =>
  tx
    .insertInto('canjes')
    .values({
      tiendaId,
      clienteId: c.clienteId,
      ...c.premio,
      hastaSelloId: c.hastaSelloId,
      descuento: c.descuento,
      origen,
      origenId,
    })
    .execute();

// Pedido cancelado: el canje se anula y los sellos vuelven.
export const anularCanje = (
  tx: Ejecutor,
  tiendaId: TiendaId,
  origen: Origen,
  origenId: number,
) =>
  tx
    .updateTable('canjes')
    .set({ anuladoEn: new Date() })
    .where('tiendaId', '=', tiendaId)
    .where('origen', '=', origen)
    .where('origenId', '=', origenId)
    .where('anuladoEn', 'is', null)
    .execute();
