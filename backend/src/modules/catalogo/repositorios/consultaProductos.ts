import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { db } from '../../../shared/db/db.js';
import { patronContiene } from '../../../shared/db/escaparLike.js';

export type FiltrosRepo = {
  buscar?: string;
  categoriaId?: number | null;
  activos?: boolean;
  stockBajo?: boolean;
};

// Base filtrada de productos de UNA tienda (para listar y contar).
export function consultaProductos(tiendaId: TiendaId, f: FiltrosRepo) {
  let q = db.selectFrom('productos').where('tiendaId', '=', tiendaId);
  if (f.activos !== undefined) q = q.where('activo', '=', f.activos);
  if (f.buscar) q = q.where('nombre', 'like', patronContiene(f.buscar));
  if (f.categoriaId === null) q = q.where('categoriaId', 'is', null);
  else if (f.categoriaId !== undefined) q = q.where('categoriaId', '=', f.categoriaId);
  // Stock bajo: stock físico en o por debajo del mínimo (si hay mínimo cargado).
  if (f.stockBajo) {
    q = q
      .where('stockMinimo', '>', 0)
      .where((eb) => eb('stock', '<=', eb.ref('stockMinimo')));
  }
  return q;
}

// Una página de productos filtrados + el total (para paginar).
export async function listarProductosRepo(
  tiendaId: TiendaId,
  filtros: FiltrosRepo,
  limite: number,
  desde: number,
) {
  const base = consultaProductos(tiendaId, filtros);
  const [filas, total] = await Promise.all([
    // id desempata nombres repetidos: la paginación no salta ni repite productos.
    base
      .selectAll()
      .orderBy('nombre')
      .orderBy('id')
      .limit(limite)
      .offset(desde)
      .execute(),
    base.select((eb) => eb.fn.countAll<number>().as('n')).executeTakeFirstOrThrow(),
  ]);
  return { filas, total: Number(total.n) };
}
