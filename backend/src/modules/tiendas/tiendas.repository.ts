import { db } from '../../shared/db/db.js';
import type { Ejecutor } from '../../shared/db/ejecutor.js';
import { idInsertado } from '../../shared/db/idInsertado.js';

export const tiendasRepo = {
  buscarPorSlug: (slug: string) =>
    db
      .selectFrom('tiendas')
      .select(['id', 'slug', 'nombre', 'estado'])
      .where('slug', '=', slug)
      .executeTakeFirst(),

  async crear(datos: { slug: string; nombre: string }, ej: Ejecutor = db) {
    return idInsertado(
      await ej.insertInto('tiendas').values(datos).executeTakeFirstOrThrow(),
    );
  },

  // Arranca los 10 días de prueba de las tiendas del dueño (una sola vez).
  iniciarPruebasDeDueno: (usuarioId: number, hasta: Date) =>
    db
      .updateTable('tiendas')
      .set({ pruebaHasta: hasta })
      .where('estado', '=', 'prueba')
      .where('pruebaHasta', 'is', null)
      .where('id', 'in', (eb) =>
        eb
          .selectFrom('miembrosTienda')
          .select('tiendaId')
          .where('usuarioId', '=', usuarioId)
          .where('rol', '=', 'dueno'),
      )
      .execute(),
};
