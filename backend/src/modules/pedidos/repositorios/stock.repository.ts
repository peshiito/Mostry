import { sql } from 'kysely';
import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';

// `reservo`: solo los ítems que reservaron stock al comprarse lo mueven (0038).
type Item = { productoId: number; cantidad: number; reservo: boolean };

const aplicar = async (
  tx: Ejecutor,
  tiendaId: TiendaId,
  items: Item[],
  cambio: (q: number) => object,
) => {
  // Mismo orden que la reserva del checkout (por producto): sin deadlocks.
  const conStock = items.filter((i) => i.reservo);
  for (const i of conStock.sort((a, b) => a.productoId - b.productoId)) {
    await tx
      .updateTable('productos')
      .set(cambio(i.cantidad))
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', i.productoId)
      .execute();
  }
};

// Movimientos de stock de un pedido inmediato. Siempre dentro de la transacción del pedido.
export const stockRepo = {
  // Pedido cancelado o vencido antes de pagar: se libera lo reservado.
  liberarReserva: (tx: Ejecutor, tiendaId: TiendaId, items: Item[]) =>
    aplicar(tx, tiendaId, items, (q) => ({
      stockReservado: sql`stock_reservado - ${q}`,
    })),

  // Pago aprobado: la reserva se convierte en venta (sale del stock real).
  descontar: (tx: Ejecutor, tiendaId: TiendaId, items: Item[]) =>
    aplicar(tx, tiendaId, items, (q) => ({
      stock: sql`stock - ${q}`,
      stockReservado: sql`stock_reservado - ${q}`,
    })),

  // Cancelado después de pagar: la mercadería vuelve al stock (decisión 26).
  devolver: (tx: Ejecutor, tiendaId: TiendaId, items: Item[]) =>
    aplicar(tx, tiendaId, items, (q) => ({ stock: sql`stock + ${q}` })),
};
