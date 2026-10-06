import type { TiendaId } from '../../shared/db/tiendaId.js';
import { db } from '../../shared/db/db.js';
import type { Ejecutor } from '../../shared/db/ejecutor.js';

export const miembrosRepo = {
  crear: (tiendaId: TiendaId, usuarioId: number, ej: Ejecutor = db) =>
    ej
      .insertInto('miembrosTienda')
      .values({ tiendaId, usuarioId, rol: 'dueno' })
      .execute(),

  async esMiembro(tiendaId: TiendaId, usuarioId: number): Promise<boolean> {
    const fila = await db
      .selectFrom('miembrosTienda')
      .select('rol')
      .where('tiendaId', '=', tiendaId)
      .where('usuarioId', '=', usuarioId)
      .executeTakeFirst();
    return fila !== undefined;
  },

  tiendasDeUsuario: (usuarioId: number) =>
    db
      .selectFrom('miembrosTienda')
      .innerJoin('tiendas', 'tiendas.id', 'miembrosTienda.tiendaId')
      .select(['tiendas.id', 'tiendas.slug', 'tiendas.nombre', 'miembrosTienda.rol'])
      .where('miembrosTienda.usuarioId', '=', usuarioId)
      .execute(),
};
