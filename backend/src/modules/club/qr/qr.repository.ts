import { db } from '../../../shared/db/db.js';

export const qrRepo = {
  // INSERT IGNORE: pedir el QR dos veces en la misma ventana no duplica nada.
  guardar: (datos: { clienteId: number; hashCodigo: string; expiraEn: Date }) =>
    db.insertInto('codigosClub').ignore().values(datos).execute(),

  duenoDe: async (hashCodigo: string, ahora = new Date()) =>
    (
      await db
        .selectFrom('codigosClub')
        .select('clienteId')
        .where('hashCodigo', '=', hashCodigo)
        .where('expiraEn', '>', ahora)
        .executeTakeFirst()
    )?.clienteId,
};
