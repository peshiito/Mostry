import type { Insertable } from 'kysely';
import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import { db } from '../../../shared/db/db.js';
import type {
  EstadoTienda,
  PagosSuscripcionTabla,
} from '../../../shared/db/tipos/tiendas.js';

// Escrituras del admin sobre la suscripción de una tienda.
export const adminEstadoRepo = {
  // FOR UPDATE: dos pagos registrados a la vez se encolan y no se pisan.
  fechasBloqueando: (tx: Ejecutor, tiendaId: number) =>
    tx
      .selectFrom('tiendas')
      .select(['slug', 'estado', 'pruebaHasta', 'planHasta', 'suspendidaManual'])
      .where('id', '=', tiendaId)
      .forUpdate()
      .executeTakeFirst(),

  registrarPago: (tx: Ejecutor, pago: Insertable<PagosSuscripcionTabla>) =>
    tx.insertInto('pagosSuscripcion').values(pago).execute(),

  extenderPlan: (tx: Ejecutor, tiendaId: number, planHasta: Date, estado: EstadoTienda) =>
    tx
      .updateTable('tiendas')
      .set({ planHasta, estado })
      .where('id', '=', tiendaId)
      .execute(),

  // Cortesía en la prueba: corre `prueba_hasta` (sin plan pago todavía).
  extenderPrueba: (
    tx: Ejecutor,
    tiendaId: number,
    pruebaHasta: Date,
    estado: EstadoTienda,
  ) =>
    tx
      .updateTable('tiendas')
      .set({ pruebaHasta, estado })
      .where('id', '=', tiendaId)
      .execute(),

  marcarSuspension: (
    tiendaId: number,
    cambios: {
      suspendidaManual: boolean;
      motivoSuspension: string | null;
      estado: EstadoTienda;
    },
  ) => db.updateTable('tiendas').set(cambios).where('id', '=', tiendaId).execute(),
};
