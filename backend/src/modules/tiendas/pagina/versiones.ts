import type { Transaction } from 'kysely';
import { db } from '../../../shared/db/db.js';
import type { Database } from '../../../shared/db/tipos/index.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';

export const MAX_VERSIONES = 10;

// Guarda una versión publicada y borra las que pasan de las últimas 10.
export async function guardarVersion(
  trx: Transaction<Database>,
  tiendaId: TiendaId,
  texto: string,
) {
  await trx.insertInto('versionesPagina').values({ tiendaId, documento: texto }).execute();
  const viejas = await trx
    .selectFrom('versionesPagina')
    .select('id')
    .where('tiendaId', '=', tiendaId)
    .orderBy('id', 'desc')
    .offset(MAX_VERSIONES)
    .limit(1000)
    .execute();
  if (viejas.length)
    await trx
      .deleteFrom('versionesPagina')
      .where('tiendaId', '=', tiendaId)
      .where(
        'id',
        'in',
        viejas.map((v) => v.id),
      )
      .execute();
}

export const listarVersiones = (tiendaId: TiendaId) =>
  db
    .selectFrom('versionesPagina')
    .select(['id', 'creadaEn'])
    .where('tiendaId', '=', tiendaId)
    .orderBy('id', 'desc')
    .execute();

// Volver a una versión la pone como borrador (hay que publicarla de nuevo).
export async function restaurarVersion(tiendaId: TiendaId, id: number) {
  const v = await db
    .selectFrom('versionesPagina')
    .select('documento')
    .where('tiendaId', '=', tiendaId)
    .where('id', '=', id)
    .executeTakeFirst();
  if (!v) throw new AppError(404, 'version_no_encontrada', 'No encontramos esa versión.');
  const texto = JSON.stringify(v.documento);
  await db
    .updateTable('paginasTienda')
    .set({ borrador: texto, actualizadoEn: new Date() })
    .where('tiendaId', '=', tiendaId)
    .execute();
  return v.documento;
}
