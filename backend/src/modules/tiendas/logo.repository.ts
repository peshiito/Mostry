import type { TiendaId } from '../../shared/db/tiendaId.js';
import { db } from '../../shared/db/db.js';

// Cambia el logo con la fila de la tienda bloqueada y devuelve el anterior:
// dos cambios a la vez no pueden perder de vista ningún archivo.
export const reemplazarLogo = (tiendaId: TiendaId, clave: string | null) =>
  db.transaction().execute(async (tx) => {
    const { logoClave } = await tx
      .selectFrom('tiendas')
      .select('logoClave')
      .where('id', '=', tiendaId)
      .forUpdate()
      .executeTakeFirstOrThrow();
    await tx
      .updateTable('tiendas')
      .set({ logoClave: clave })
      .where('id', '=', tiendaId)
      .execute();
    return logoClave;
  });
