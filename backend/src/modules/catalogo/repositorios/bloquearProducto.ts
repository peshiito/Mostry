import type { TiendaId } from '../../../shared/db/tiendaId.js';
import type { Ejecutor } from '../../../shared/db/ejecutor.js';

// SELECT ... FOR UPDATE sobre el producto: agregar, borrar y reordenar sus fotos
// quedan en fila, uno por vez. false si el producto no es de esta tienda.
export async function bloquearProducto(
  tx: Ejecutor,
  tiendaId: TiendaId,
  productoId: number,
) {
  const fila = await tx
    .selectFrom('productos')
    .select('id')
    .where('tiendaId', '=', tiendaId)
    .where('id', '=', productoId)
    .forUpdate()
    .executeTakeFirst();
  return fila !== undefined;
}
