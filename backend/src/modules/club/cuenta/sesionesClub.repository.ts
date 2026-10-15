import type { Insertable } from 'kysely';
import { db } from '../../../shared/db/db.js';
import type { SesionesClubTabla } from '../../../shared/db/tipos/club.js';

export const sesionesClubRepo = {
  crear: (datos: Insertable<SesionesClubTabla>) =>
    db.insertInto('sesionesClub').values(datos).execute(),

  // Solo sesiones no vencidas de clientes activos.
  buscarVigente: (hashToken: string) =>
    db
      .selectFrom('sesionesClub')
      .innerJoin('clientes', 'clientes.id', 'sesionesClub.clienteId')
      .select(['sesionesClub.id', 'sesionesClub.clienteId', 'sesionesClub.expiraEn'])
      .where('sesionesClub.hashToken', '=', hashToken)
      .where('sesionesClub.expiraEn', '>', new Date())
      .where('clientes.activo', '=', true)
      .executeTakeFirst(),

  extender: (id: number, expiraEn: Date) =>
    db
      .updateTable('sesionesClub')
      .set({ expiraEn, ultimoUsoEn: new Date() })
      .where('id', '=', id)
      .execute(),

  borrar: (id: number) => db.deleteFrom('sesionesClub').where('id', '=', id).execute(),

  borrarDeCliente: (clienteId: number) =>
    db.deleteFrom('sesionesClub').where('clienteId', '=', clienteId).execute(),
};

export type SesionClubVigente = NonNullable<
  Awaited<ReturnType<typeof sesionesClubRepo.buscarVigente>>
>;
