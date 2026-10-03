import { AppError } from '../../../shared/errors/AppError.js';
import { resumenSuscripcion } from '../../tiendas/servicios/estadoSuscripcion.js';
import { adminDetalleRepo } from '../repositorios/adminDetalle.repository.js';
import { adminTiendasRepo } from '../repositorios/adminTiendas.repository.js';

export const tiendaNoEncontrada = () =>
  new AppError(404, 'tienda_no_encontrada', 'No existe esa tienda.');

export async function detalleTienda(id: number) {
  const tienda = await adminTiendasRepo.buscarPorId(id);
  if (!tienda) throw tiendaNoEncontrada();
  const [duenos, conteos, pagos] = await Promise.all([
    adminDetalleRepo.duenos(id),
    adminDetalleRepo.conteos(id),
    adminDetalleRepo.pagos(id),
  ]);
  return { tienda, suscripcion: resumenSuscripcion(tienda), duenos, conteos, pagos };
}
