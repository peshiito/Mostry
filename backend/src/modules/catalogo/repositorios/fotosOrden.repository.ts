import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { sql } from 'kysely';
import { db } from '../../../shared/db/db.js';
import { bloquearProducto } from './bloquearProducto.js';

// Con el producto bloqueado: compara contra las fotos actuales y aplica el orden
// en un solo UPDATE. La primera (orden 0) es la principal.
export const reordenarFotos = (tiendaId: TiendaId, productoId: number, ids: number[]) =>
  db.transaction().execute(async (tx): Promise<'sin_producto' | 'invalido' | 'ok'> => {
    if (!(await bloquearProducto(tx, tiendaId, productoId))) return 'sin_producto';
    const actuales = await tx
      .selectFrom('productoFotos')
      .select('id')
      .where('tiendaId', '=', tiendaId)
      .where('productoId', '=', productoId)
      .execute();
    const ids_ = new Set(actuales.map((f) => f.id));
    if (ids.length !== ids_.size || !ids.every((id) => ids_.has(id))) return 'invalido';
    if (ids.length === 0) return 'ok';

    const casos = sql.join(
      ids.map((id, orden) => sql`WHEN ${id} THEN ${orden}`),
      sql` `,
    );
    await tx
      .updateTable('productoFotos')
      .set({ orden: sql<number>`CASE id ${casos} END` })
      .where('tiendaId', '=', tiendaId)
      .where('productoId', '=', productoId)
      .where('id', 'in', ids)
      .execute();
    return 'ok';
  });
