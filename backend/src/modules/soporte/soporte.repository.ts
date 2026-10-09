import { db } from '../../shared/db/db.js';
import type { TiendaId } from '../../shared/db/tiendaId.js';

const HORA_MS = 60 * 60 * 1000;

// Accesos de soporte y su registro, siempre de UNA tienda.
export const soporteRepo = {
  vigente: (tiendaId: TiendaId) =>
    db
      .selectFrom('accesosSoporte')
      .select(['id', 'creadoEn', 'venceEn'])
      .where('tiendaId', '=', tiendaId)
      .where('venceEn', '>', new Date())
      .where('revocadoEn', 'is', null)
      .orderBy('id', 'desc')
      .executeTakeFirst(),

  // Un permiso nuevo corta los anteriores: siempre hay como mucho uno vigente.
  otorgar: (tiendaId: TiendaId, usuarioId: number) =>
    db.transaction().execute(async (tx) => {
      await tx
        .updateTable('accesosSoporte')
        .set({ revocadoEn: new Date() })
        .where('tiendaId', '=', tiendaId)
        .where('revocadoEn', 'is', null)
        .execute();
      await tx
        .insertInto('accesosSoporte')
        .values({
          tiendaId,
          otorgadoPor: usuarioId,
          venceEn: new Date(Date.now() + HORA_MS),
        })
        .execute();
    }),

  revocar: (tiendaId: TiendaId) =>
    db
      .updateTable('accesosSoporte')
      .set({ revocadoEn: new Date() })
      .where('tiendaId', '=', tiendaId)
      .where('revocadoEn', 'is', null)
      .execute(),

  registro: (tiendaId: TiendaId) =>
    db
      .selectFrom('registroSoporte')
      .select(['id', 'accion', 'creadoEn'])
      .where('tiendaId', '=', tiendaId)
      .orderBy('id', 'desc')
      .limit(100)
      .execute(),

  anotar: (fila: {
    tiendaId: TiendaId;
    accesoId: number;
    adminId: number;
    accion: string;
    metodo: string;
    ruta: string;
  }) => db.insertInto('registroSoporte').values(fila).execute(),
};
