import { db } from '../../shared/db/db.js';
import type { TiendaId } from '../../shared/db/tiendaId.js';

const RECLAMO_MS = 5 * 60_000; // un reclamo sin terminar se libera a los 5 min
const MAX_INTENTOS = 5;

export type Filtro = { ahora: Date; tiendaId?: TiendaId; soloViejos?: boolean };

export const colaRepo = {
  // Pendientes y libres. El worker (soloViejos) deja 20 s a la API para mandarlos.
  pendientes: ({ ahora, tiendaId, soloViejos }: Filtro) => {
    let q = db
      .selectFrom('avisosPush')
      .selectAll()
      .where('enviadoEn', 'is', null)
      .where('intentos', '<', MAX_INTENTOS)
      .where((eb) =>
        eb.or([
          eb('reclamadoEn', 'is', null),
          eb('reclamadoEn', '<', new Date(ahora.getTime() - RECLAMO_MS)),
        ]),
      );
    if (tiendaId) q = q.where('tiendaId', '=', tiendaId);
    if (soloViejos) q = q.where('creadoEn', '<=', new Date(ahora.getTime() - 20_000));
    return q.orderBy('id').limit(100).execute();
  },

  // UPDATE atómico: si otro proceso lo reclamó primero, no lo manda este.
  async reclamar(id: number, ahora: Date) {
    const r = await db
      .updateTable('avisosPush')
      .set((eb) => ({ reclamadoEn: ahora, intentos: eb('intentos', '+', 1) }))
      .where('id', '=', id)
      .where('enviadoEn', 'is', null)
      .where((eb) =>
        eb.or([
          eb('reclamadoEn', 'is', null),
          eb('reclamadoEn', '<', new Date(ahora.getTime() - RECLAMO_MS)),
        ]),
      )
      .executeTakeFirst();
    return r.numUpdatedRows === 1n;
  },

  marcarEnviado: (id: number, ahora: Date) =>
    db.updateTable('avisosPush').set({ enviadoEn: ahora }).where('id', '=', id).execute(),

  // Lo mandado (o que se rindió) hace más de 7 días ya no hace falta.
  limpiar: (ahora: Date) =>
    db
      .deleteFrom('avisosPush')
      .where('creadoEn', '<', new Date(ahora.getTime() - 7 * 24 * 3600_000))
      .execute(),
};
