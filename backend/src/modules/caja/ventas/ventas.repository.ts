import { sql } from 'kysely';
import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import { idInsertado } from '../../../shared/db/idInsertado.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import type { VentaItemsTabla } from '../../../shared/db/tipos/caja.js';
import type { Insertable } from 'kysely';

// Todo dentro de la transacción de la venta.
export const ventasRepo = {
  productos: (tx: Ejecutor, tiendaId: TiendaId, ids: number[]) =>
    tx
      .selectFrom('productos')
      .select([
        'id',
        'nombre',
        'precio',
        'activo',
        'modoStock',
        'stock',
        'stockReservado',
      ])
      .where('tiendaId', '=', tiendaId)
      .where('id', 'in', ids)
      .execute(),

  // Solo lo que se cuenta por unidades descuenta stock, sin tocar lo reservado
  // por pedidos online (UPDATE condicional: nunca queda negativo).
  async descontar(
    tx: Ejecutor,
    tiendaId: TiendaId,
    productoId: number,
    cantidad: number,
  ) {
    const r = await tx
      .updateTable('productos')
      .set({ stock: sql`stock - ${cantidad}` })
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', productoId)
      .where(sql<boolean>`stock - stock_reservado >= ${cantidad}`)
      .executeTakeFirst();
    return r.numUpdatedRows === 1n;
  },

  async insertar(
    tx: Ejecutor,
    venta: {
      tiendaId: TiendaId;
      numero: number;
      total: number;
      descuento: number;
      medio: 'efectivo' | 'transferencia';
      clienteId: number | null;
    },
    items: Omit<Insertable<VentaItemsTabla>, 'ventaId' | 'tiendaId'>[],
  ) {
    const ventaId = idInsertado(
      await tx.insertInto('ventas').values(venta).executeTakeFirstOrThrow(),
    );
    await tx
      .insertInto('ventaItems')
      .values(items.map((i) => ({ ...i, ventaId, tiendaId: venta.tiendaId })))
      .execute();
    return ventaId;
  },
};
