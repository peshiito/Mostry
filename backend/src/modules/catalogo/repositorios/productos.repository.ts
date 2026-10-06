import type { TiendaId } from '../../../shared/db/tiendaId.js';
import type { Insertable, Updateable } from 'kysely';
import { db } from '../../../shared/db/db.js';
import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import { idInsertado } from '../../../shared/db/idInsertado.js';
import type { ProductosTabla } from '../../../shared/db/tipos/catalogo.js';

type Internos = 'id' | 'tiendaId' | 'stockReservado';
type FilaNueva = Omit<Insertable<ProductosTabla>, Internos>;
export type CambiosFila = Omit<Updateable<ProductosTabla>, Internos>;

// Toda función exige tiendaId (sección 4.1).
export const productosRepo = {
  buscar: (tiendaId: TiendaId, id: number) =>
    db
      .selectFrom('productos')
      .selectAll()
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', id)
      .executeTakeFirst(),

  async crear(tiendaId: TiendaId, datos: FilaNueva, ej: Ejecutor = db) {
    return idInsertado(
      await ej
        .insertInto('productos')
        .values({ ...datos, tiendaId })
        .executeTakeFirstOrThrow(),
    );
  },

  // UN solo UPDATE (todo o nada). Si cambia el stock, solo se aplica si sigue
  // valiendo lo que el comerciante vio (stockAnterior) y no queda por debajo
  // de lo reservado. Devuelve false si esa condición no se cumplió.
  async actualizar(
    tiendaId: TiendaId,
    id: number,
    cambios: CambiosFila,
    stockAnterior?: number,
    ej: Ejecutor = db,
  ) {
    let q = ej
      .updateTable('productos')
      .set(cambios)
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', id);
    if (cambios.stock !== undefined && stockAnterior !== undefined) {
      q = q
        .where('stock', '=', stockAnterior)
        .where('stockReservado', '<=', Number(cambios.stock));
    }
    const r = await q.executeTakeFirst();
    return r.numUpdatedRows === 1n;
  },
};
