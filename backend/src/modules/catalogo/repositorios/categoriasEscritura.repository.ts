import { db } from '../../../shared/db/db.js';
import { idInsertado } from '../../../shared/db/idInsertado.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { tocoFilas } from './tocoFilas.js';

// Escrituras. Toda función exige tiendaId. Nada se borra: se desactiva.
export const categoriasEscrituraRepo = {
  async crear(tiendaId: TiendaId, nombre: string, orden: number) {
    const r = await db
      .insertInto('categorias')
      .values({ tiendaId, nombre, orden })
      .executeTakeFirstOrThrow();
    return idInsertado(r);
  },

  // false si no existe o está desactivada (por ejemplo, la desactivaron en otra pestaña).
  async renombrar(tiendaId: TiendaId, id: number, nombre: string): Promise<boolean> {
    const r = await db
      .updateTable('categorias')
      .set({ nombre })
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', id)
      .where('activa', '=', true)
      .executeTakeFirst();
    return tocoFilas(r, 1);
  },

  // Sus productos quedan "Sin categoría" (no se tocan de otra forma).
  // FOR UPDATE: nadie le asigna productos entre el UPDATE y la desactivación.
  desactivar: (tiendaId: TiendaId, id: number) =>
    db.transaction().execute(async (tx) => {
      const existe = await tx
        .selectFrom('categorias')
        .select('id')
        .where('tiendaId', '=', tiendaId)
        .where('id', '=', id)
        .where('activa', '=', true)
        .forUpdate()
        .executeTakeFirst();
      if (!existe) return false;
      await tx
        .updateTable('productos')
        .set({ categoriaId: null })
        .where('tiendaId', '=', tiendaId)
        .where('categoriaId', '=', id)
        .execute();
      await tx
        .updateTable('categorias')
        .set({ activa: false })
        .where('tiendaId', '=', tiendaId)
        .where('id', '=', id)
        .execute();
      return true;
    }),
};
