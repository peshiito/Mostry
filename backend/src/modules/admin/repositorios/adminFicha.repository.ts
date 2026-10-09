import { db } from '../../../shared/db/db.js';

// Ficha de una tienda para el admin.
export const adminFichaRepo = {
  // Solo lo de la suscripción y el contacto: nunca alias de cobro ni números del
  // negocio (privacidad del comercio, sección 13).
  buscar: (id: number) =>
    db
      .selectFrom('tiendas')
      .select([
        'id',
        'slug',
        'nombre',
        'estado',
        'pruebaHasta',
        'planHasta',
        'suspendidaManual',
        'motivoSuspension',
        'creadoEn',
        'whatsapp',
      ])
      .where('id', '=', id)
      .executeTakeFirst(),
};
