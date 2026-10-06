import { db } from '../../shared/db/db.js';
import { idInsertado } from '../../shared/db/idInsertado.js';
import type { TiendaId } from '../../shared/db/tiendaId.js';

// Notas sueltas de la libreta (recordatorios del comerciante).
export const notasRepo = {
  listar: (tiendaId: TiendaId) =>
    db
      .selectFrom('notas')
      .select(['id', 'texto', 'fecha'])
      .where('tiendaId', '=', tiendaId)
      .orderBy('fecha', 'desc')
      .orderBy('id', 'desc')
      .limit(200)
      .execute(),

  async crear(tiendaId: TiendaId, texto: string) {
    return idInsertado(
      await db
        .insertInto('notas')
        .values({ tiendaId, texto, fecha: new Date() })
        .executeTakeFirstOrThrow(),
    );
  },

  async editar(tiendaId: TiendaId, id: number, texto: string) {
    const r = await db
      .updateTable('notas')
      .set({ texto })
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', id)
      .executeTakeFirst();
    return r.numUpdatedRows === 1n;
  },

  // Las notas son recordatorios personales: a diferencia de clientes y productos, se pueden borrar.
  async borrar(tiendaId: TiendaId, id: number) {
    const r = await db
      .deleteFrom('notas')
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', id)
      .executeTakeFirst();
    return r.numDeletedRows === 1n;
  },
};
