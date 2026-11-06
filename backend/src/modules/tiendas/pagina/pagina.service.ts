import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import type { DocumentoPagina } from './esquemaPagina.js';
import { guardarVersion } from './versiones.js';

// La página de la tienda: el borrador (lo que edita el comercio) y lo publicado
// (lo que ve el comprador). Una fila por tienda.
export async function leerPagina(tiendaId: TiendaId) {
  const fila = await db
    .selectFrom('paginasTienda')
    .select(['borrador', 'publicado', 'version', 'actualizadoEn', 'publicadoEn'])
    .where('tiendaId', '=', tiendaId)
    .executeTakeFirst();
  return (
    fila ?? {
      borrador: null,
      publicado: null,
      version: 0,
      actualizadoEn: null,
      publicadoEn: null,
    }
  );
}

export async function guardarBorrador(tiendaId: TiendaId, doc: DocumentoPagina) {
  const texto = JSON.stringify(doc);
  await db
    .insertInto('paginasTienda')
    .values({ tiendaId, borrador: texto })
    .onDuplicateKeyUpdate({ borrador: texto, actualizadoEn: new Date() })
    .execute();
}

// Publicar copia el borrador a lo público y guarda la versión para volver atrás.
export async function publicar(tiendaId: TiendaId) {
  return db.transaction().execute(async (trx) => {
    const fila = await trx
      .selectFrom('paginasTienda')
      .select(['borrador', 'version'])
      .where('tiendaId', '=', tiendaId)
      .forUpdate()
      .executeTakeFirst();
    if (!fila?.borrador)
      throw new AppError(409, 'sin_borrador', 'Todavía no armaste ningún cambio.');
    const texto = JSON.stringify(fila.borrador);
    const ahora = new Date();
    await trx
      .updateTable('paginasTienda')
      .set({ publicado: texto, version: fila.version + 1, publicadoEn: ahora })
      .where('tiendaId', '=', tiendaId)
      .execute();
    await guardarVersion(trx, tiendaId, texto);
    return { version: fila.version + 1, publicadoEn: ahora };
  });
}

// "Volver a la página de siempre": borra el borrador y lo publicado (las
// versiones quedan, por si quiere recuperar alguna).
export async function volverALaDeSiempre(tiendaId: TiendaId) {
  await db.deleteFrom('paginasTienda').where('tiendaId', '=', tiendaId).execute();
}
