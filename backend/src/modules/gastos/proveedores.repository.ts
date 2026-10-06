import type { Updateable } from 'kysely';
import type { Ejecutor } from '../../shared/db/ejecutor.js';
import { db } from '../../shared/db/db.js';
import { idInsertado } from '../../shared/db/idInsertado.js';
import type { TiendaId } from '../../shared/db/tiendaId.js';
import type { ProveedoresTabla } from '../../shared/db/tipos/caja.js';

const columnas = ['id', 'nombre', 'contacto', 'activo'] as const;

export const proveedoresRepo = {
  listar: (tiendaId: TiendaId, incluirInactivos: boolean) => {
    let q = db
      .selectFrom('proveedores')
      .select(columnas)
      .where('tiendaId', '=', tiendaId);
    if (!incluirInactivos) q = q.where('activo', '=', true);
    return q.orderBy('nombre').execute();
  },

  // Con tx, lo lee con FOR SHARE: nadie lo desactiva mientras se registra un gasto.
  buscarActivo: (tiendaId: TiendaId, id: number, tx?: Ejecutor) => {
    const q = (tx ?? db)
      .selectFrom('proveedores')
      .select(columnas)
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', id)
      .where('activo', '=', true);
    return (tx ? q.forShare() : q).executeTakeFirst();
  },

  buscar: (tiendaId: TiendaId, id: number) =>
    db
      .selectFrom('proveedores')
      .select(columnas)
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', id)
      .executeTakeFirst(),

  async crear(tiendaId: TiendaId, nombre: string, contacto: string | null) {
    return idInsertado(
      await db
        .insertInto('proveedores')
        .values({ tiendaId, nombre, contacto })
        .executeTakeFirstOrThrow(),
    );
  },

  actualizar: (
    tiendaId: TiendaId,
    id: number,
    cambios: Omit<Updateable<ProveedoresTabla>, 'id' | 'tiendaId'>,
  ) =>
    db
      .updateTable('proveedores')
      .set(cambios)
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', id)
      .execute(),
};
