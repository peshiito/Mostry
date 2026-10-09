import { logger } from '../../../shared/logger.js';
import { estadoEfectivo } from '../../tiendas/servicios/estadoSuscripcion.js';
import { adminEstadoRepo } from '../repositorios/adminEstado.repository.js';
import { adminFichaRepo } from '../repositorios/adminFicha.repository.js';
import { tiendaNoEncontrada } from './detalle.service.js';

// Suspender no borra nada: la tienda pública muestra "Cerrada temporalmente"
// y el panel queda en solo lectura.
export async function suspenderTienda(tiendaId: number, adminId: number, motivo: string) {
  if (!(await adminFichaRepo.buscar(tiendaId))) throw tiendaNoEncontrada();
  await adminEstadoRepo.marcarSuspension(tiendaId, {
    suspendidaManual: true,
    motivoSuspension: motivo,
    estado: 'suspendida',
  });
  logger.info({ tiendaId, adminId, motivo }, 'Admin suspendió una tienda');
  return { estado: 'suspendida' as const };
}

// Al reactivar vuelve al estado que le toca por sus fechas.
export async function reactivarTienda(tiendaId: number, adminId: number) {
  const tienda = await adminFichaRepo.buscar(tiendaId);
  if (!tienda) throw tiendaNoEncontrada();
  const estado = estadoEfectivo({ ...tienda, suspendidaManual: false });
  await adminEstadoRepo.marcarSuspension(tiendaId, {
    suspendidaManual: false,
    motivoSuspension: null,
    estado,
  });
  logger.info({ tiendaId, adminId, estado }, 'Admin reactivó una tienda');
  return { estado };
}
