import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { db } from '../../../shared/db/db.js';
import { idInsertado } from '../../../shared/db/idInsertado.js';
import { bloquearProducto } from './bloquearProducto.js';

type Registro =
  | { estado: 'sin_producto' }
  | { estado: 'lleno' }
  | { estado: 'ok'; id: number; orden: number };

// Toda función exige tiendaId y productoId. "clave" es la BASE de la foto.
export const fotosRepo = {
  listar: (tiendaId: TiendaId, productoId: number) =>
    db
      .selectFrom('productoFotos')
      .select(['id', 'clave', 'orden'])
      .where('tiendaId', '=', tiendaId)
      .where('productoId', '=', productoId)
      .orderBy('orden')
      .orderBy('id')
      .execute(),

  // Con el producto bloqueado: controla el máximo y la pone al final (MAX(orden)+1).
  registrar: (tiendaId: TiendaId, productoId: number, clave: string, max: number) =>
    db.transaction().execute(async (tx): Promise<Registro> => {
      if (!(await bloquearProducto(tx, tiendaId, productoId)))
        return { estado: 'sin_producto' };
      const { n, ultimo } = await tx
        .selectFrom('productoFotos')
        .select((eb) => [
          eb.fn.countAll<number>().as('n'),
          eb.fn.max('orden').as('ultimo'),
        ])
        .where('tiendaId', '=', tiendaId)
        .where('productoId', '=', productoId)
        .executeTakeFirstOrThrow();
      if (Number(n) >= max) return { estado: 'lleno' };
      const orden = ultimo === null ? 0 : Number(ultimo) + 1;
      const r = await tx
        .insertInto('productoFotos')
        .values({ tiendaId, productoId, clave, orden })
        .executeTakeFirstOrThrow();
      return { estado: 'ok', id: idInsertado(r), orden };
    }),

  // Devuelve la base de la foto borrada, o undefined si no existía en ESE producto.
  borrar: (tiendaId: TiendaId, productoId: number, fotoId: number) =>
    db.transaction().execute(async (tx) => {
      if (!(await bloquearProducto(tx, tiendaId, productoId))) return undefined;
      const foto = await tx
        .selectFrom('productoFotos')
        .select('clave')
        .where('tiendaId', '=', tiendaId)
        .where('productoId', '=', productoId)
        .where('id', '=', fotoId)
        .executeTakeFirst();
      if (foto) {
        await tx
          .deleteFrom('productoFotos')
          .where('tiendaId', '=', tiendaId)
          .where('productoId', '=', productoId)
          .where('id', '=', fotoId)
          .execute();
      }
      return foto?.clave;
    }),
};
