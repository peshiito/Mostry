import { sql } from 'kysely';
import { db } from '../../../shared/db/db.js';
import type { CodigosEmailClubTabla } from '../../../shared/db/tipos/club.js';

type Proposito = CodigosEmailClubTabla['proposito'];
const MAX_INTENTOS = 5;

// Igual que los códigos del panel (auth/codigosEmail.repository), para clientes.
export const codigosEmailClubRepo = {
  // Un código nuevo anula los anteriores del mismo propósito.
  invalidarAnteriores: (clienteId: number, proposito: Proposito) =>
    db
      .updateTable('codigosEmailClub')
      .set({ usadoEn: new Date() })
      .where('clienteId', '=', clienteId)
      .where('proposito', '=', proposito)
      .where('usadoEn', 'is', null)
      .execute(),

  crear: (datos: {
    clienteId: number;
    proposito: Proposito;
    hashCodigo: string;
    expiraEn: Date;
  }) => db.insertInto('codigosEmailClub').values(datos).execute(),

  buscarVigente: (clienteId: number, proposito: Proposito) =>
    db
      .selectFrom('codigosEmailClub')
      .select(['id', 'hashCodigo'])
      .where('clienteId', '=', clienteId)
      .where('proposito', '=', proposito)
      .where('usadoEn', 'is', null)
      .where('expiraEn', '>', new Date())
      .where('intentos', '<', MAX_INTENTOS)
      .orderBy('id', 'desc')
      .executeTakeFirst(),

  sumarIntento: (id: number) =>
    db
      .updateTable('codigosEmailClub')
      .set({ intentos: sql`intentos + 1` })
      .where('id', '=', id)
      .execute(),

  // Atómico: si dos requests usan el mismo código, gana una sola.
  async marcarUsado(id: number): Promise<boolean> {
    const r = await db
      .updateTable('codigosEmailClub')
      .set({ usadoEn: new Date() })
      .where('id', '=', id)
      .where('usadoEn', 'is', null)
      .executeTakeFirst();
    return r.numUpdatedRows === 1n;
  },
};
