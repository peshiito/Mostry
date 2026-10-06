import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';

const activas = (tiendaId: TiendaId) =>
  db.selectFrom('categorias').where('tiendaId', '=', tiendaId).where('activa', '=', true);

// Lecturas de categorías ACTIVAS. Toda función exige tiendaId.
export const categoriasRepo = {
  listar: (tiendaId: TiendaId) =>
    activas(tiendaId)
      .select(['categorias.id', 'categorias.nombre', 'categorias.orden'])
      .select((eb) =>
        eb
          .selectFrom('productos')
          .select(eb.fn.countAll<number>().as('n'))
          .whereRef('productos.categoriaId', '=', 'categorias.id')
          .whereRef('productos.tiendaId', '=', 'categorias.tiendaId')
          .where('productos.activo', '=', true)
          .as('productosActivos'),
      )
      .orderBy('categorias.orden')
      .orderBy('categorias.id')
      .execute(),

  buscar: (tiendaId: TiendaId, id: number) =>
    activas(tiendaId)
      .select(['id', 'nombre', 'orden'])
      .where('id', '=', id)
      .executeTakeFirst(),

  async ids(tiendaId: TiendaId): Promise<number[]> {
    return (await activas(tiendaId).select('id').execute()).map((c) => c.id);
  },

  async siguienteOrden(tiendaId: TiendaId): Promise<number> {
    const fila = await activas(tiendaId)
      .select((eb) => eb.fn.max('orden').as('max'))
      .executeTakeFirst();
    return fila?.max === null || fila?.max === undefined ? 0 : Number(fila.max) + 1;
  },
};
