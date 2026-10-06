import type { Updateable } from 'kysely';
import { db } from '../../shared/db/db.js';
import { idInsertado } from '../../shared/db/idInsertado.js';
import type { TiendaId } from '../../shared/db/tiendaId.js';
import type { PromocionesTabla } from '../../shared/db/tipos/catalogo.js';

type Cambios = Omit<Updateable<PromocionesTabla>, 'id' | 'tiendaId'>;
const columnas = ['id', 'titulo', 'descripcion', 'desde', 'hasta', 'activa'] as const;

export const promocionesRepo = {
  listar: (tiendaId: TiendaId) =>
    db
      .selectFrom('promociones')
      .select(columnas)
      .where('tiendaId', '=', tiendaId)
      .orderBy('hasta', 'desc')
      .execute(),

  buscar: (tiendaId: TiendaId, id: number) =>
    db
      .selectFrom('promociones')
      .select(columnas)
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', id)
      .executeTakeFirst(),

  async crear(
    tiendaId: TiendaId,
    datos: {
      titulo: string;
      descripcion: string | null;
      desde: Date;
      hasta: Date;
      activa: boolean;
    },
  ) {
    return idInsertado(
      await db
        .insertInto('promociones')
        .values({ ...datos, tiendaId })
        .executeTakeFirstOrThrow(),
    );
  },

  actualizar: (tiendaId: TiendaId, id: number, cambios: Cambios) =>
    db
      .updateTable('promociones')
      .set(cambios)
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', id)
      .execute(),
};
