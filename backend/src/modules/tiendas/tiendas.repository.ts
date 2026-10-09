import { db } from '../../shared/db/db.js';
import type { Ejecutor } from '../../shared/db/ejecutor.js';
import { idInsertado } from '../../shared/db/idInsertado.js';
import { comoTiendaId } from '../../shared/db/tiendaId.js';

export const tiendasRepo = {
  // Fuente confiable del id de una tienda: lo devuelve ya como TiendaId.
  async buscarPorSlug(slug: string) {
    const t = await db
      .selectFrom('tiendas')
      .select(['id', 'slug', 'nombre', 'estado'])
      .where('slug', '=', slug)
      .executeTakeFirst();
    return t && { ...t, id: comoTiendaId(t.id) };
  },

  // Para el admin, que recibe el id por la URL: solo devuelve un TiendaId si existe.
  async verificarId(id: number) {
    const t = await db
      .selectFrom('tiendas')
      .select('id')
      .where('id', '=', id)
      .executeTakeFirst();
    return t ? comoTiendaId(t.id) : null;
  },

  // Modo soporte: la tienda con un acceso vigente (no vencido ni revocado) que dio
  // el comercio. Es el único camino por el que el admin opera el catálogo, los
  // horarios y los datos de una tienda.
  async conSoporteVigente(id: number) {
    const t = await db
      .selectFrom('tiendas')
      .innerJoin('accesosSoporte as a', 'a.tiendaId', 'tiendas.id')
      .select(['tiendas.id', 'tiendas.slug', 'a.id as accesoId'])
      .where('tiendas.id', '=', id)
      .where('a.venceEn', '>', new Date())
      .where('a.revocadoEn', 'is', null)
      .orderBy('a.id', 'desc')
      .executeTakeFirst();
    return t && { id: comoTiendaId(t.id), slug: t.slug, accesoId: t.accesoId };
  },

  async crear(datos: { slug: string; nombre: string }, ej: Ejecutor = db) {
    const r = await ej.insertInto('tiendas').values(datos).executeTakeFirstOrThrow();
    return comoTiendaId(idInsertado(r));
  },

  // Arranca los 10 días de prueba de las tiendas del dueño (una sola vez).
  iniciarPruebasDeDueno: (usuarioId: number, hasta: Date) =>
    db
      .updateTable('tiendas')
      .set({ pruebaHasta: hasta })
      .where('estado', '=', 'prueba')
      .where('pruebaHasta', 'is', null)
      .where('id', 'in', (eb) =>
        eb
          .selectFrom('miembrosTienda')
          .select('tiendaId')
          .where('usuarioId', '=', usuarioId)
          .where('rol', '=', 'dueno'),
      )
      .execute(),
};
