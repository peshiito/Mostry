import { AppError } from '../../../shared/errors/AppError.js';
import { resumenSuscripcion } from '../../tiendas/servicios/estadoSuscripcion.js';
import { tiendasRepo } from '../../tiendas/tiendas.repository.js';
import { adminDetalleRepo } from '../repositorios/adminDetalle.repository.js';
import { adminFichaRepo } from '../repositorios/adminFicha.repository.js';
import { soporteRepo } from '../../soporte/soporte.repository.js';

export const tiendaNoEncontrada = () =>
  new AppError(404, 'tienda_no_encontrada', 'No existe esa tienda.');

export async function detalleTienda(id: number) {
  const tiendaId = await tiendasRepo.verificarId(id);
  const tienda = tiendaId && (await adminFichaRepo.buscar(tiendaId));
  if (!tiendaId || !tienda) throw tiendaNoEncontrada();
  const [duenos, conteos, pagos, acceso] = await Promise.all([
    adminDetalleRepo.duenos(tiendaId),
    adminDetalleRepo.conteos(tiendaId),
    adminDetalleRepo.pagos(tiendaId),
    soporteRepo.vigente(tiendaId),
  ]);
  // soporte: si el comercio dio permiso para ayudarlo, hasta cuándo.
  const soporte = acceso ? { venceEn: acceso.venceEn } : null;
  return {
    tienda,
    suscripcion: resumenSuscripcion(tienda),
    duenos,
    conteos,
    pagos,
    soporte,
  };
}
