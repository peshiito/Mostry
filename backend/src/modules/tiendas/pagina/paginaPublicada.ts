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

// El borrador (para "Mirala en tu celu"); sin borrador, lo publicado.
async function paginaBorrador(tiendaId: TiendaId) {
  const fila = await db
    .selectFrom('paginasTienda')
    .select(['borrador', 'publicado'])
    .where('tiendaId', '=', tiendaId)
    .executeTakeFirst();
  return fila?.borrador ?? fila?.publicado ?? null;
}

// Para la vidriera: la página publicada (o el borrador, con un token válido) y
// solo las imágenes que usa.
export async function paginaConMedios(tiendaId: TiendaId, borrador = false) {
  const pagina = borrador
    ? await paginaBorrador(tiendaId)
    : await paginaPublicada(tiendaId);
  const medios = pagina
    ? await mediosPorId(tiendaId, mediosDePagina(pagina.bloques))
    : [];
  return { pagina, medios, ...(borrador ? { vistaBorrador: true } : {}) };
}
