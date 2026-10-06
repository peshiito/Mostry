import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';

// Configuración de la tienda que necesitan el checkout y el seguimiento.
export const tiendaParaPedido = (tiendaId: TiendaId) =>
  db
    .selectFrom('tiendas')
    .select([
      'slug',
      'nombre',
      'alias',
      'titularAlias',
      'whatsapp',
      'aceptaEnvio',
      'aceptaRetiro',
      'costoEnvio',
      'plazoComprobanteHoras',
      'plazoSenaHoras',
      'anticipacionEncargoHoras',
      'senaPorcentaje',
    ])
    .where('id', '=', tiendaId)
    .executeTakeFirstOrThrow();

export type TiendaParaPedido = Awaited<ReturnType<typeof tiendaParaPedido>>;
