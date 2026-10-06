import { config } from '../../config/env.js';
import { db } from '../../shared/db/db.js';
import type { Mailer } from '../../shared/email/mailer.js';
import { logger } from '../../shared/logger.js';
import { procesarTienda } from './procesarTienda.js';

// Job (diario): guarda el estado calculado de cada tienda (caché para el admin)
// y manda cada aviso UNA vez por vencimiento (tabla avisos_suscripcion).
// Una tienda con problemas no frena a las demás.
export async function actualizarSuscripciones(mailer: Mailer, ahora = new Date()) {
  const tiendas = await db
    .selectFrom('tiendas')
    .select(['id', 'nombre', 'estado', 'pruebaHasta', 'planHasta', 'suspendidaManual'])
    .where((eb) =>
      eb.or([eb('pruebaHasta', 'is not', null), eb('planHasta', 'is not', null)]),
    )
    .execute();
  const pago = {
    alias: config.MOSTRY_ALIAS,
    titular: config.MOSTRY_TITULAR,
    monto: config.PRECIO_MENSUAL,
  };
  const total = { revisadas: tiendas.length, actualizadas: 0, avisos: 0, fallidas: 0 };
  for (const t of tiendas) {
    try {
      const r = await procesarTienda(t, mailer, pago, ahora);
      if (r.actualizada) total.actualizadas++;
      if (r.avisada) total.avisos++;
    } catch (err) {
      logger.error(
        { err, tiendaId: t.id },
        'No se pudo procesar la suscripción de una tienda',
      );
      total.fallidas++;
    }
  }
  return total;
}
