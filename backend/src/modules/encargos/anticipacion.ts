import { db } from '../../shared/db/db.js';
import type { TiendaId } from '../../shared/db/tiendaId.js';

// Encargos 3: la anticipación de un encargo es la mayor entre la de la tienda
// y la de cada producto (NULL = usa la de la tienda).
export async function anticipacionDelEncargo(
  tiendaId: TiendaId,
  deLaTienda: number,
  productoIds: number[],
) {
  if (productoIds.length === 0) return deLaTienda;
  const r = await db
    .selectFrom('productos')
    .select((eb) => eb.fn.max('anticipacionHoras').as('horas'))
    .where('tiendaId', '=', tiendaId)
    .where('id', 'in', productoIds)
    .executeTakeFirst();
  return Math.max(deLaTienda, Number(r?.horas ?? 0));
}

// La tienda con la anticipación que corresponde a los productos del encargo.
export async function conAnticipacion<T extends { anticipacionEncargoHoras: number }>(
  t: T,
  tiendaId: TiendaId,
  d: { tipo: string; items: { productoId: number }[] },
): Promise<T> {
  if (d.tipo !== 'encargo') return t;
  const ids = d.items.map((i) => i.productoId);
  const horas = await anticipacionDelEncargo(tiendaId, t.anticipacionEncargoHoras, ids);
  return { ...t, anticipacionEncargoHoras: horas };
}
