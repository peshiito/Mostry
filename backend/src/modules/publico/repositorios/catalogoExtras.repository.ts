import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';

export const catalogoExtrasRepo = {
  // Solo categorías activas que tienen al menos un producto activo.
  categorias: (tiendaId: TiendaId) =>
    db
      .selectFrom('categorias')
      .innerJoin('productos', (j) =>
        j
          .onRef('productos.categoriaId', '=', 'categorias.id')
          .onRef('productos.tiendaId', '=', 'categorias.tiendaId'),
      )
      .select(['categorias.id', 'categorias.nombre'])
      .select((eb) => eb.fn.countAll<number>().as('productos'))
      .where('categorias.tiendaId', '=', tiendaId)
      .where('categorias.activa', '=', true)
      .where('productos.activo', '=', true)
      .groupBy(['categorias.id', 'categorias.nombre', 'categorias.orden'])
      .orderBy('categorias.orden')
      .execute(),

  // Fotos de varios productos en UNA consulta (sin N+1).
  fotos: (tiendaId: TiendaId, productoIds: number[]) =>
    productoIds.length === 0
      ? Promise.resolve([])
      : db
          .selectFrom('productoFotos')
          .select(['id', 'productoId', 'clave', 'orden'])
          .where('tiendaId', '=', tiendaId)
          .where('productoId', 'in', productoIds)
          .orderBy('productoId')
          .orderBy('orden')
          .orderBy('id')
          .execute(),
};
