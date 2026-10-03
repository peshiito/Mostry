import { db } from '../../../shared/db/db.js';

export const codigosRecuperacionRepo = {
  // Reemplaza los códigos del usuario por un juego nuevo.
  async reemplazar(usuarioId: number, hashes: string[]): Promise<void> {
    await db.transaction().execute(async (tx) => {
      await tx
        .deleteFrom('codigosRecuperacion')
        .where('usuarioId', '=', usuarioId)
        .execute();
      const filas = hashes.map((hashCodigo) => ({ usuarioId, hashCodigo }));
      await tx.insertInto('codigosRecuperacion').values(filas).execute();
    });
  },

  // Atómico: cada código sirve una sola vez.
  async usar(usuarioId: number, hashCodigo: string): Promise<boolean> {
    const r = await db
      .updateTable('codigosRecuperacion')
      .set({ usadoEn: new Date() })
      .where('usuarioId', '=', usuarioId)
      .where('hashCodigo', '=', hashCodigo)
      .where('usadoEn', 'is', null)
      .executeTakeFirst();
    return r.numUpdatedRows === 1n;
  },
};
