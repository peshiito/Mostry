import { db } from '../shared/db/db.js';
import { crearAdminLogueado } from './adminCompleto.js';
import { tiendaLista } from './tiendaLista.js';

export const idDeTienda = async (slug: string) =>
  (
    await db
      .selectFrom('tiendas')
      .select('id')
      .where('slug', '=', slug)
      .executeTakeFirstOrThrow()
  ).id;

// Tienda lista + admin logueado + la ruta base del modo soporte de esa tienda.
// `conPermiso`: la dueña ya le dio acceso de soporte a Mostry.
export async function soporteListo(conPermiso = true) {
  const t = await tiendaLista();
  const admin = await crearAdminLogueado(t.app);
  const base = `/admin/soporte/${await idDeTienda('dona-rosa')}`;
  if (conPermiso) await t.panel.post('/panel/soporte/acceso').expect(200);
  return { t, admin, base };
}
