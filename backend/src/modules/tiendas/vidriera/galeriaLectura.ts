import { borrarPublicos, urlPublica } from '../../../shared/archivos/almacenamiento.js';
import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';

// Fotos del local de una tienda (siempre por tienda), en orden.
export const fotosGaleria = (tiendaId: TiendaId) =>
  db
    .selectFrom('galeriaTienda')
    .select(['id', 'clave'])
    .where('tiendaId', '=', tiendaId)
    .orderBy('orden')
    .orderBy('id')
    .execute()
    .then((f) => f.map((x) => ({ id: x.id, url: urlPublica(x.clave) })));

export async function borrarFoto(tiendaId: TiendaId, id: number) {
  const fila = await db
    .selectFrom('galeriaTienda')
    .select('clave')
    .where('tiendaId', '=', tiendaId)
    .where('id', '=', id)
    .executeTakeFirst();
  if (!fila) throw new AppError(404, 'foto_no_encontrada', 'No encontramos esa foto.');
  await db
    .deleteFrom('galeriaTienda')
    .where('tiendaId', '=', tiendaId)
    .where('id', '=', id)
    .execute();
  await borrarPublicos(tiendaId, [fila.clave]);
}
