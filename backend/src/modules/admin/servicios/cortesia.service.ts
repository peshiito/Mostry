import { AppError } from '../../../shared/errors/AppError.js';
import { tiendasRepo } from '../../tiendas/tiendas.repository.js';
import { db } from '../../../shared/db/db.js';
import { logger } from '../../../shared/logger.js';
import { adminEstadoRepo } from '../repositorios/adminEstado.repository.js';
import type { DatosCortesia } from '../schemas.js';
import { tiendaNoEncontrada } from './detalle.service.js';

const DIA_MS = 24 * 60 * 60 * 1000;
const hoy = () =>
  new Date().toLocaleDateString('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' });
const mayor = (...fechas: (Date | null)[]) =>
  fechas.filter((f): f is Date => f !== null).reduce((a, b) => (a > b ? a : b));

const sinVerificar = () =>
  new AppError(409, 'sin_verificar', 'La tienda todavía no verificó su email.');

// S1: el admin le regala días a una tienda. Sin plan pago todavía, se corre la
// prueba; si no, el plan (desde la fecha que tenga, o desde hoy si venció).
// Una suspensión manual se respeta: suma los días pero sigue suspendida.
export async function regalarDias(id: number, adminId: number, datos: DatosCortesia) {
  const tiendaId = await tiendasRepo.verificarId(id);
  if (!tiendaId) throw tiendaNoEncontrada();
  const resultado = await db.transaction().execute(async (tx) => {
    const t = await adminEstadoRepo.fechasBloqueando(tx, tiendaId);
    if (!t) throw tiendaNoEncontrada();
    // Sin verificar el email la prueba no arrancó: regalar días le pisaría los 7.
    if (!t.pruebaHasta && !t.planHasta) throw sinVerificar();
    const enPrueba = t.planHasta === null;
    const desde = enPrueba
      ? mayor(t.pruebaHasta, new Date())
      : mayor(t.pruebaHasta, t.planHasta, new Date());
    const hasta = new Date(desde.getTime() + datos.dias * DIA_MS);
    const vigente = enPrueba ? 'prueba' : 'activa';
    const estado = t.suspendidaManual ? 'suspendida' : vigente;
    if (enPrueba) await adminEstadoRepo.extenderPrueba(tx, tiendaId, hasta, estado);
    else await adminEstadoRepo.extenderPlan(tx, tiendaId, hasta, estado);
    await adminEstadoRepo.registrarPago(tx, {
      tiendaId,
      tipo: 'cortesia',
      monto: 0,
      pagadoEn: hoy(),
      periodoDesde: desde,
      periodoHasta: hasta,
      registradoPor: adminId,
      nota: datos.motivo,
    });
    // La constancia va en la misma transacción: sin ella no se regala nada.
    await tx
      .insertInto('registroAdmin')
      .values({
        adminId,
        tiendaId,
        tiendaSlug: t.slug,
        accion: 'cortesia',
        detalle: `+${datos.dias} días: ${datos.motivo}`,
      })
      .execute();
    return { periodoDesde: desde, periodoHasta: hasta, estado };
  });
  logger.info({ tiendaId, adminId, dias: datos.dias }, 'Admin regaló días de cortesía');
  return resultado;
}
