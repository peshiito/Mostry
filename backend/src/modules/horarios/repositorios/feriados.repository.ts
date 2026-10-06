import { db } from '../../../shared/db/db.js';
import { idInsertado } from '../../../shared/db/idInsertado.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';

export const feriadosRepo = {
  // Desde una fecha 'YYYY-MM-DD' (hora argentina) en adelante; hasta opcional.
  listar: (tiendaId: TiendaId, desde: string, hasta?: string) => {
    let q = db
      .selectFrom('feriados')
      .select(['id', 'fecha', 'motivo'])
      .where('tiendaId', '=', tiendaId)
      .where('fecha', '>=', desde);
    if (hasta) q = q.where('fecha', '<=', hasta);
    return q.orderBy('fecha').execute();
  },

  async crear(tiendaId: TiendaId, fecha: string, motivo: string | null) {
    const r = await db
      .insertInto('feriados')
      .values({ tiendaId, fecha, motivo })
      .executeTakeFirstOrThrow();
    return idInsertado(r);
  },

  async borrar(tiendaId: TiendaId, id: number): Promise<boolean> {
    const r = await db
      .deleteFrom('feriados')
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', id)
      .executeTakeFirst();
    return r.numDeletedRows === 1n;
  },
};
