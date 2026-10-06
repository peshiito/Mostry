import { sql } from 'kysely';
import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import { idInsertado } from '../../../shared/db/idInsertado.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import type { PedidoItemsTabla, PedidosTabla } from '../../../shared/db/tipos/pedidos.js';
import type { Insertable } from 'kysely';

// Todo se usa dentro de UNA transacción (tx) del checkout.
export const checkoutRepo = {
  productos: (tx: Ejecutor, tiendaId: TiendaId, ids: number[]) =>
    tx
      .selectFrom('productos')
      .select(['id', 'nombre', 'precio', 'activo', 'agotado', 'aceptaEncargo'])
      .where('tiendaId', '=', tiendaId)
      .where('id', 'in', ids)
      .execute(),

  // UPDATE condicional atómico: nunca se vende de más, aunque compren 100 a la vez.
  async reservar(tx: Ejecutor, tiendaId: TiendaId, productoId: number, cantidad: number) {
    const r = await tx
      .updateTable('productos')
      .set({ stockReservado: sql`stock_reservado + ${cantidad}` })
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', productoId)
      .where('activo', '=', true)
      .where('agotado', '=', false)
      .where(sql<boolean>`stock - stock_reservado >= ${cantidad}`)
      .executeTakeFirst();
    return r.numUpdatedRows === 1n;
  },

  // Correlativo por tienda sin carreras: LAST_INSERT_ID(expr) queda en la conexión.
  async siguienteNumero(tx: Ejecutor, tiendaId: TiendaId): Promise<number> {
    const r = await tx
      .updateTable('tiendas')
      .set({ ultimoNumeroPedido: sql`LAST_INSERT_ID(ultimo_numero_pedido + 1)` })
      .where('id', '=', tiendaId)
      .executeTakeFirst();
    // Sin fila, LAST_INSERT_ID() devolvería un id viejo de la conexión: nunca usarlo.
    if (r.numUpdatedRows !== 1n)
      throw new Error(`No se pudo numerar el pedido de la tienda ${tiendaId}`);
    const { rows } = await sql<{ n: number }>`SELECT LAST_INSERT_ID() AS n`.execute(tx);
    return Number(rows[0]!.n);
  },

  async insertar(
    tx: Ejecutor,
    pedido: Insertable<PedidosTabla>,
    items: Omit<Insertable<PedidoItemsTabla>, 'pedidoId'>[],
  ) {
    const pedidoId = idInsertado(
      await tx.insertInto('pedidos').values(pedido).executeTakeFirstOrThrow(),
    );
    await tx
      .insertInto('pedidoItems')
      .values(items.map((i) => ({ ...i, pedidoId })))
      .execute();
    return pedidoId;
  },
};
