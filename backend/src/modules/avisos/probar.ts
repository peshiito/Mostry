import { db } from '../../shared/db/db.js';
import type { TiendaId } from '../../shared/db/tiendaId.js';
import { transportePush } from './transporte.js';

// "Mandar un aviso de prueba": solo a los teléfonos de quien lo pide. Un
// teléfono que ya no existe se borra. Devuelve a cuántos les llegó.
export async function probarAvisos(tiendaId: TiendaId, usuarioId: number) {
  const telefonos = await db
    .selectFrom('suscripcionesPush')
    .select(['id', 'endpoint', 'p256dh', 'auth'])
    .where('tiendaId', '=', tiendaId)
    .where('usuarioId', '=', usuarioId)
    .execute();
  let enviados = 0;
  for (const d of telefonos) {
    const r = await transportePush
      .enviar(d, {
        titulo: '🔔 ¡Listo! Así te van a llegar los pedidos',
        cuerpo: 'Tocá acá para abrir tu panel.',
        url: '/panel',
        tag: 'prueba',
        silencioso: false,
        pendientes: 0,
      })
      .catch(() => 'falla' as const);
    if (r === 'ok') enviados++;
    if (r === 'no_existe')
      await db.deleteFrom('suscripcionesPush').where('id', '=', d.id).execute();
  }
  return { enviados, telefonos: telefonos.length };
}
