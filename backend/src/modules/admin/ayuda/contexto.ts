import { AppError } from '../../../shared/errors/AppError.js';
import { tiendasRepo } from '../../tiendas/tiendas.repository.js';
import { tiendaNoEncontrada } from '../servicios/detalle.service.js';
import { ayudaRepo } from './ayuda.repository.js';

// La tienda (con su TiendaId verificado) y su dueño, o 404.
export async function tiendaYDueno(id: number) {
  const tiendaId = await tiendasRepo.verificarId(id);
  const tienda = await ayudaRepo.tienda(id);
  if (!tiendaId || !tienda) throw tiendaNoEncontrada();
  const dueno = await ayudaRepo.dueno(tiendaId);
  if (!dueno) throw new AppError(409, 'sin_dueno', 'Esa tienda no tiene dueño.');
  return { tiendaId, tienda, dueno };
}

// Deja constancia de la ayuda (sin datos personales: solo qué se hizo).
export const anotar = (
  adminId: number,
  tienda: { id: number; slug: string },
  accion: string,
  detalle?: string,
) =>
  ayudaRepo.anotar({
    adminId,
    tiendaId: tienda.id,
    tiendaSlug: tienda.slug,
    accion,
    detalle,
  });
