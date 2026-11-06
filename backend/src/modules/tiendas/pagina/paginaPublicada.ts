import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { mediosPorId } from '../medios/mediosLectura.js';
import { mediosDePagina } from './esquemaPortada.js';

// Lo que ve el comprador (null: la tienda no armó su página y se usa la de siempre).
export async function paginaPublicada(tiendaId: TiendaId) {
  const fila = await db
    .selectFrom('paginasTienda')
    .select('publicado')
    .where('tiendaId', '=', tiendaId)
    .executeTakeFirst();
  return fila?.publicado ?? null;
}

// Para la vidriera: la página publicada y solo las imágenes que usa.
export async function paginaConMedios(tiendaId: TiendaId) {
  const pagina = await paginaPublicada(tiendaId);
  const medios = pagina
    ? await mediosPorId(tiendaId, mediosDePagina(pagina.bloques))
    : [];
  return { pagina, medios };
}
