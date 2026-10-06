import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { sql } from 'kysely';
import { db } from '../../../shared/db/db.js';
import { tocoFilas } from './tocoFilas.js';

class OrdenIncompleto extends Error {}

export const categoriasOrdenRepo = {
  // Un solo UPDATE con CASE. Si no tocó todas las filas pedidas, no aplica nada.
  async reordenar(tiendaId: TiendaId, ids: number[]): Promise<boolean> {
    if (ids.length === 0) return true;
    const casos = sql.join(
      ids.map((id, orden) => sql`WHEN ${id} THEN ${orden}`),
      sql` `,
    );
    return db
      .transaction()
      .execute(async (tx) => {
        const r = await tx
          .updateTable('categorias')
          .set({ orden: sql<number>`CASE id ${casos} END` })
          .where('tiendaId', '=', tiendaId)
          .where('id', 'in', ids)
          .executeTakeFirst();
        if (!tocoFilas(r, ids.length)) throw new OrdenIncompleto();
        return true;
      })
      .catch((err: unknown) => {
        if (err instanceof OrdenIncompleto) return false;
        throw err;
      });
  },
};
