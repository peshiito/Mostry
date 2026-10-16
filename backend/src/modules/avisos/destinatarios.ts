import { db } from '../../shared/db/db.js';
import type { TiendaId } from '../../shared/db/tiendaId.js';

// Los teléfonos de los miembros de la tienda, con el horario de silencio de cada uno.
export const destinatarios = (tiendaId: TiendaId) =>
  db
    .selectFrom('suscripcionesPush as s')
    .innerJoin('miembrosTienda as m', (j) =>
      j.onRef('m.tiendaId', '=', 's.tiendaId').onRef('m.usuarioId', '=', 's.usuarioId'),
    )
    .select([
      's.id',
      's.endpoint',
      's.p256dh',
      's.auth',
      'm.silencioDesde',
      'm.silencioHasta',
    ])
    .where('s.tiendaId', '=', tiendaId)
    .execute();

// Lo que espera a la tienda: el número del ícono de la app.
export async function pendientesDeTienda(tiendaId: TiendaId) {
  const r = await db
    .selectFrom('pedidos')
    .select((eb) => eb.fn.countAll<number>().as('n'))
    .where('tiendaId', '=', tiendaId)
    .where((eb) =>
      eb.or([
        eb('estado', '=', 'comprobante_enviado'),
        eb.and([eb('estado', '=', 'pendiente_confirmacion'), eb('tipo', '=', 'encargo')]),
      ]),
    )
    .executeTakeFirstOrThrow();
  return Number(r.n);
}
