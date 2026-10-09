import { sql } from 'kysely';
import { db } from '../../../shared/db/db.js';
import type { CodigosEmailTabla } from '../../../shared/db/tipos/usuarios.js';

type Proposito = CodigosEmailTabla['proposito'];
const MAX_INTENTOS = 5;

export const codigosEmailRepo = {
  // Un código nuevo anula los anteriores del mismo propósito.
  invalidarAnteriores: (usuarioId: number, proposito: Proposito) =>
    db
      .updateTable('codigosEmail')
      .set({ usadoEn: new Date() })
      .where('usuarioId', '=', usuarioId)
      .where('proposito', '=', proposito)
      .where('usadoEn', 'is', null)
      .execute(),

  crear: (datos: {
    usuarioId: number;
    proposito: Proposito;
    hashCodigo: string;
    expiraEn: Date;
  }) => db.insertInto('codigosEmail').values(datos).execute(),

  buscarVigente: (usuarioId: number, proposito: Proposito) =>
    db
      .selectFrom('codigosEmail')
      .select(['id', 'hashCodigo'])
      .where('usuarioId', '=', usuarioId)
      .where('proposito', '=', proposito)
      .where('usadoEn', 'is', null)
      .where('expiraEn', '>', new Date())
      .where('intentos', '<', MAX_INTENTOS)
      .orderBy('id', 'desc')
      .executeTakeFirst(),

  sumarIntento: (id: number) =>
    db
      .updateTable('codigosEmail')
      .set({ intentos: sql`intentos + 1` })
      .where('id', '=', id)
      .execute(),

  // Atómico: si dos requests usan el mismo código, gana una sola.
  async marcarUsado(id: number): Promise<boolean> {
    const r = await db
      .updateTable('codigosEmail')
      .set({ usadoEn: new Date() })
      .where('id', '=', id)
      .where('usadoEn', 'is', null)
      .executeTakeFirst();
    return r.numUpdatedRows === 1n;
  },
};
