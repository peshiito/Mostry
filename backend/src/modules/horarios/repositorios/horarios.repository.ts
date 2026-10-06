import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import type { Tramo } from '../servicios/apertura.js';

// MySQL guarda TIME como 'HH:MM:SS'; la API habla en 'HH:MM'.
const corta = (hora: string) => hora.slice(0, 5);

export const horariosRepo = {
  async listar(tiendaId: TiendaId): Promise<Tramo[]> {
    const filas = await db
      .selectFrom('horarios')
      .select(['diaSemana', 'abre', 'cierra'])
      .where('tiendaId', '=', tiendaId)
      .orderBy('diaSemana')
      .orderBy('abre')
      .execute();
    return filas.map((f) => ({
      diaSemana: f.diaSemana,
      abre: corta(f.abre),
      cierra: corta(f.cierra),
    }));
  },

  // La semana completa se reemplaza de una vez (todo o nada). Bloquear la fila
  // de la tienda pone en fila dos guardados simultáneos (sin deadlock).
  reemplazar: (tiendaId: TiendaId, tramos: Tramo[]) =>
    db.transaction().execute(async (tx) => {
      await tx
        .selectFrom('tiendas')
        .select('id')
        .where('id', '=', tiendaId)
        .forUpdate()
        .execute();
      await tx.deleteFrom('horarios').where('tiendaId', '=', tiendaId).execute();
      if (tramos.length)
        await tx
          .insertInto('horarios')
          .values(tramos.map((t) => ({ ...t, tiendaId })))
          .execute();
    }),
};
