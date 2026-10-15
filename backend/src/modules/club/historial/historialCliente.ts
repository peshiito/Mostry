import { db } from '../../../shared/db/db.js';
import { comprasDe } from './compras.js';

// "Mis compras" del cliente: en todas las tiendas, con el nombre de cada una.
// No devuelve ids internos.
export async function historialCliente(clienteId: number) {
  const compras = await comprasDe(clienteId);
  const ids = [...new Set(compras.map((c) => c.tiendaId))];
  const tiendas = ids.length
    ? await db
        .selectFrom('tiendas')
        .select(['id', 'slug', 'nombre'])
        .where('id', 'in', ids)
        .execute()
    : [];
  const deTienda = new Map(tiendas.map((t) => [t.id, t]));
  return compras.map(({ id: _id, tiendaId, ...c }) => ({
    ...c,
    tienda: {
      slug: deTienda.get(tiendaId)?.slug,
      nombre: deTienda.get(tiendaId)?.nombre,
    },
  }));
}
