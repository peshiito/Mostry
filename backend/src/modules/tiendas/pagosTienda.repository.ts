import { db } from '../../shared/db/db.js';
import type { TiendaId } from '../../shared/db/tiendaId.js';

// "Pagos registrados" del comercio: pagos y cortesías (sin quién los cargó).
export const pagosTiendaRepo = {
  ultimos: (tiendaId: TiendaId) =>
    db
      .selectFrom('pagosSuscripcion')
      .select(['id', 'tipo', 'monto', 'pagadoEn', 'periodoDesde', 'periodoHasta', 'nota'])
      .where('tiendaId', '=', tiendaId)
      .orderBy('id', 'desc')
      .limit(24)
      .execute(),
};
