import type { Insertable } from 'kysely';
import { db } from '../../../shared/db/db.js';
import type { EstadoSesion, SesionesTabla } from '../../../shared/db/tipos/usuarios.js';

export const sesionesRepo = {
  crear: (datos: Insertable<SesionesTabla>) =>
    db.insertInto('sesiones').values(datos).execute(),

  // Solo sesiones no vencidas de usuarios activos.
  buscarVigente: (hashToken: string) =>
    db
      .selectFrom('sesiones')
      .innerJoin('usuarios', 'usuarios.id', 'sesiones.usuarioId')
      .select([
        'sesiones.id',
        'sesiones.usuarioId',
        'sesiones.tipo',
        'sesiones.estado',
        'sesiones.expiraEn',
        'usuarios.esAdmin',
      ])
      .where('sesiones.hashToken', '=', hashToken)
      .where('sesiones.expiraEn', '>', new Date())
      .where('usuarios.activo', '=', true)
      .executeTakeFirst(),

  actualizar: (id: number, cambios: { estado?: EstadoSesion; expiraEn?: Date }) =>
    db
      .updateTable('sesiones')
      .set({ ...cambios, ultimoUsoEn: new Date() })
      .where('id', '=', id)
      .execute(),

  borrar: (id: number) => db.deleteFrom('sesiones').where('id', '=', id).execute(),

  // Cierra todas las sesiones del usuario (menos, opcionalmente, la actual).
  borrarDeUsuario: (usuarioId: number, exceptoId?: number) => {
    let consulta = db.deleteFrom('sesiones').where('usuarioId', '=', usuarioId);
    if (exceptoId !== undefined) consulta = consulta.where('id', '!=', exceptoId);
    return consulta.execute();
  },
};

export type SesionVigente = NonNullable<
  Awaited<ReturnType<typeof sesionesRepo.buscarVigente>>
>;
