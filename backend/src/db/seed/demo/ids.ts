import { db } from '../../../shared/db/db.js';
import { comoTiendaId } from '../../../shared/db/tiendaId.js';

// Id de la tienda y de sus productos por nombre (la demo usa nombres legibles).
export async function idsDe(slug: string) {
  const t = await db
    .selectFrom('tiendas')
    .select('id')
    .where('slug', '=', slug)
    .executeTakeFirstOrThrow();
  const tiendaId = comoTiendaId(t.id);
  const productos = await db
    .selectFrom('productos')
    .select(['id', 'nombre'])
    .where('tiendaId', '=', tiendaId)
    .execute();
  return {
    tiendaId,
    producto: (nombre: string) => productos.find((p) => p.nombre === nombre)!.id,
  };
}
