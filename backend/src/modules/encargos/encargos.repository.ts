import { db } from '../../shared/db/db.js';
import type { TiendaId } from '../../shared/db/tiendaId.js';

// Encargos (no cancelados) entre dos instantes, con sus ítems: dos consultas en total.
export async function encargosEntre(tiendaId: TiendaId, desde: Date, hasta: Date) {
  const pedidos = await db
    .selectFrom('pedidos')
    .select([
      'id',
      'numero',
      'estado',
      'clienteNombre',
      'clienteWhatsapp',
      'entrega',
      'fechaEncargo',
      'total',
      'sena',
    ])
    .where('tiendaId', '=', tiendaId)
    .where('tipo', '=', 'encargo')
    .where('estado', '!=', 'cancelado')
    .where('fechaEncargo', '>=', desde)
    .where('fechaEncargo', '<', hasta)
    .orderBy('fechaEncargo')
    .orderBy('id')
    .execute();
  if (pedidos.length === 0) return [];
  const items = await db
    .selectFrom('pedidoItems')
    .select(['pedidoId', 'nombre', 'cantidad'])
    .where('tiendaId', '=', tiendaId)
    .where(
      'pedidoId',
      'in',
      pedidos.map((p) => p.id),
    )
    .orderBy('id')
    .execute();
  return pedidos.map((p) => ({
    ...p,
    items: items.filter((i) => i.pedidoId === p.id).map(({ pedidoId: _p, ...i }) => i),
  }));
}
