import { db } from '../../shared/db/db.js';
import type { TiendaId } from '../../shared/db/tiendaId.js';
import type { DatosSuscripcion } from './esquemas.js';

type Miembro = { tiendaId: TiendaId; usuarioId: number };

// Teléfonos con avisos de un miembro de la tienda (siempre con tienda y usuario).
export const suscripcionesRepo = {
  // El endpoint es único: si el navegador lo vuelve a mandar, se actualiza.
  guardar: (m: Miembro, s: DatosSuscripcion) =>
    db
      .insertInto('suscripcionesPush')
      .values({
        ...m,
        endpoint: s.endpoint,
        p256dh: s.keys.p256dh,
        auth: s.keys.auth,
        dispositivo: s.dispositivo ?? null,
      })
      // Mismo teléfono y misma tienda (cada subdominio tiene su service worker):
      // si entró otro usuario de la tienda, el teléfono pasa a ser suyo.
      .onDuplicateKeyUpdate({
        usuarioId: m.usuarioId,
        p256dh: s.keys.p256dh,
        auth: s.keys.auth,
        dispositivo: s.dispositivo ?? null,
        fallos: 0,
        ultimoUsoEn: new Date(),
      })
      .execute(),

  borrar: (m: Miembro, endpoint: string) =>
    db
      .deleteFrom('suscripcionesPush')
      .where('tiendaId', '=', m.tiendaId)
      .where('usuarioId', '=', m.usuarioId)
      .where('endpoint', '=', endpoint)
      .execute(),

  contar: async (m: Miembro) =>
    Number(
      (
        await db
          .selectFrom('suscripcionesPush')
          .select((eb) => eb.fn.countAll<number>().as('n'))
          .where('tiendaId', '=', m.tiendaId)
          .where('usuarioId', '=', m.usuarioId)
          .executeTakeFirstOrThrow()
      ).n,
    ),
};
