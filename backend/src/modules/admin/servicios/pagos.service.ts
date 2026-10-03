import { db } from '../../../shared/db/db.js';
import { logger } from '../../../shared/logger.js';
import { adminEstadoRepo } from '../repositorios/adminEstado.repository.js';
import type { DatosPago } from '../schemas.js';
import { tiendaNoEncontrada } from './detalle.service.js';

const DIAS_PLAN = 30;
const DIA_MS = 24 * 60 * 60 * 1000;

// El plan se extiende 30 días desde max(prueba_hasta, plan_hasta, ahora):
// si paga antes de que venza, no pierde los días que le quedaban.
export async function registrarPago(tiendaId: number, adminId: number, datos: DatosPago) {
  const resultado = await db.transaction().execute(async (tx) => {
    const fechas = await adminEstadoRepo.fechasBloqueando(tx, tiendaId);
    if (!fechas) throw tiendaNoEncontrada();
    const base = [fechas.pruebaHasta, fechas.planHasta, new Date()]
      .filter((f): f is Date => f !== null)
      .reduce((a, b) => (a > b ? a : b));
    const periodoHasta = new Date(base.getTime() + DIAS_PLAN * DIA_MS);
    await adminEstadoRepo.registrarPago(tx, {
      tiendaId,
      monto: datos.monto,
      pagadoEn: datos.pagadoEn,
      periodoDesde: base,
      periodoHasta,
      registradoPor: adminId,
      nota: datos.nota ?? null,
    });
    const estado = fechas.suspendidaManual ? 'suspendida' : 'activa';
    await adminEstadoRepo.extenderPlan(tx, tiendaId, periodoHasta, estado);
    return { periodoDesde: base, periodoHasta, estado };
  });
  logger.info({ tiendaId, adminId, monto: datos.monto }, 'Admin registró un pago');
  return resultado;
}
