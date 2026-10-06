import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { categoriasRepo } from '../repositorios/categorias.repository.js';
import { categoriasOrdenRepo } from '../repositorios/categoriasOrden.repository.js';

// Hay que mandar TODAS las categorías de la tienda, cada una una vez.
export async function reordenarCategorias(tiendaId: TiendaId, ids: number[]) {
  const actuales = new Set(await categoriasRepo.ids(tiendaId));
  const mismas = ids.length === actuales.size && ids.every((id) => actuales.has(id));
  if (!mismas || !(await categoriasOrdenRepo.reordenar(tiendaId, ids))) {
    throw new AppError(
      400,
      'orden_invalido',
      'Mandá todas tus categorías, cada una una vez.',
    );
  }
  return categoriasRepo.listar(tiendaId);
}
