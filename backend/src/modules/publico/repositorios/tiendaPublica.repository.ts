import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';

// Solo lo que puede ver cualquier comprador (nada de estado interno ni datos del dueño).
export const tiendaPublicaRepo = {
  buscar: (tiendaId: TiendaId) =>
    db
      .selectFrom('tiendas')
      .select([
        'nombre',
        'frase',
        'logoClave',
        'paleta',
        'whatsapp',
        'direccion',
        'aceptaEnvio',
        'aceptaRetiro',
        'costoEnvio',
        'zonaEnvio',
        'senaPorcentaje',
        'anticipacionEncargoHoras',
        'estado',
        'pruebaHasta',
        'planHasta',
        'suspendidaManual',
      ])
      .where('id', '=', tiendaId)
      .executeTakeFirstOrThrow(),

  promocionesVigentes: (tiendaId: TiendaId, ahora: Date) =>
    db
      .selectFrom('promociones')
      .select(['id', 'titulo', 'descripcion', 'hasta'])
      .where('tiendaId', '=', tiendaId)
      .where('activa', '=', true)
      .where('desde', '<=', ahora)
      .where('hasta', '>', ahora)
      .orderBy('hasta')
      .execute(),
};
