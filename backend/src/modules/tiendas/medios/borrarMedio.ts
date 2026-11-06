import { borrarPublicos } from '../../../shared/archivos/almacenamiento.js';
import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { archivosDeMedio } from './procesarMedio.js';

// Saca una imagen de la biblioteca y borra sus archivos. Si una página la usaba,
// ese bloque se muestra sin ella.
export async function borrarMedio(tiendaId: TiendaId, id: number) {
  const fila = await db
    .selectFrom('mediosTienda')
    .select(['clave', 'tipo'])
    .where('tiendaId', '=', tiendaId)
    .where('id', '=', id)
    .executeTakeFirst();
  if (!fila) throw new AppError(404, 'medio_no_encontrado', 'No encontramos esa imagen.');
  await db
    .deleteFrom('mediosTienda')
    .where('tiendaId', '=', tiendaId)
    .where('id', '=', id)
    .execute();
  await borrarPublicos(tiendaId, archivosDeMedio(fila.clave, fila.tipo));
}
