import { db } from '../../../shared/db/db.js';
import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import { esFkInvalida } from '../../../shared/db/esFkInvalida.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';

const invalida = () =>
  new AppError(400, 'categoria_invalida', 'Esa categoría no existe.');

// Escribe el producto en una transacción que primero lee la categoría con
// FOR SHARE: si en paralelo la están desactivando, espera y ve el resultado
// final. Así un producto nunca queda en una categoría desactivada.
export async function conCategoriaValida<T>(
  tiendaId: TiendaId,
  categoriaId: number | null | undefined,
  escribir: (tx: Ejecutor) => Promise<T>,
): Promise<T> {
  try {
    return await db.transaction().execute(async (tx) => {
      if (categoriaId) {
        const activa = await tx
          .selectFrom('categorias')
          .select('id')
          .where('tiendaId', '=', tiendaId)
          .where('id', '=', categoriaId)
          .where('activa', '=', true)
          .forShare()
          .executeTakeFirst();
        if (!activa) throw invalida();
      }
      return escribir(tx);
    });
  } catch (err) {
    // Red de seguridad: la FK compuesta rechaza categorías de otra tienda.
    if (esFkInvalida(err, 'fk_productos_categoria')) throw invalida();
    throw err;
  }
}
