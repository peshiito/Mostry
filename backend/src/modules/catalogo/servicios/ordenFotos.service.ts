import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { reordenarFotos } from '../repositorios/fotosOrden.repository.js';
import { listarFotos } from './fotos.service.js';

// Hay que mandar todas las fotos del producto, cada una una vez.
export async function ordenarFotos(
  tiendaId: TiendaId,
  productoId: number,
  ids: number[],
) {
  const resultado = await reordenarFotos(tiendaId, productoId, ids);
  if (resultado === 'sin_producto') {
    throw new AppError(404, 'producto_no_encontrado', 'No encontramos ese producto.');
  }
  if (resultado === 'invalido') {
    throw new AppError(
      400,
      'orden_invalido',
      'Mandá todas las fotos del producto, cada una una vez.',
    );
  }
  return listarFotos(tiendaId, productoId);
}
