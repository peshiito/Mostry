import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';

// Lo que el admin necesita para ayudar con una cuenta. Solo datos de acceso:
// nunca ventas, caja ni compradores (privacidad del comercio, sección 13).
export const ayudaRepo = {
  tienda: (id: number) =>
    db
      .selectFrom('tiendas')
      .select(['id', 'slug', 'nombre', 'estado', 'creadoEn'])
      .where('id', '=', id)
      .executeTakeFirst(),

  dueno: (tiendaId: TiendaId) =>
    db
      .selectFrom('miembrosTienda')
      .innerJoin('usuarios', 'usuarios.id', 'miembrosTienda.usuarioId')
      .select([
        'usuarios.id',
        'usuarios.email',
        'usuarios.nombre',
        'usuarios.emailVerificadoEn',
      ])
      .where('miembrosTienda.tiendaId', '=', tiendaId)
      .where('miembrosTienda.rol', '=', 'dueno')
      .executeTakeFirst(),

  anotar: (fila: {
    adminId: number;
    tiendaId: number | null;
    tiendaSlug: string;
    accion: string;
    detalle?: string;
  }) =>
    db
      .insertInto('registroAdmin')
      .values({ detalle: null, ...fila })
      .execute(),
};
