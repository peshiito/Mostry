import { db } from '../../shared/db/db.js';
import type { TiendaId } from '../../shared/db/tiendaId.js';

type Miembro = { tiendaId: TiendaId; usuarioId: number };
const corta = (h: string | null) => (h ? h.slice(0, 5) : null); // "23:00:00" → "23:00"

// Horario de silencio de un miembro: en ese rango los avisos llegan sin sonido.
export const silencioRepo = {
  ver: async (m: Miembro) => {
    const f = await db
      .selectFrom('miembrosTienda')
      .select(['silencioDesde', 'silencioHasta'])
      .where('tiendaId', '=', m.tiendaId)
      .where('usuarioId', '=', m.usuarioId)
      .executeTakeFirst();
    return {
      desde: corta(f?.silencioDesde ?? null),
      hasta: corta(f?.silencioHasta ?? null),
    };
  },
  guardar: (m: Miembro, s: { desde: string | null; hasta: string | null }) =>
    db
      .updateTable('miembrosTienda')
      .set({ silencioDesde: s.desde, silencioHasta: s.hasta })
      .where('tiendaId', '=', m.tiendaId)
      .where('usuarioId', '=', m.usuarioId)
      .execute(),
};
