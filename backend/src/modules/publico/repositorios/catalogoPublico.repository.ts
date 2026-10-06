import { db } from '../../../shared/db/db.js';
import { patronContiene } from '../../../shared/db/escaparLike.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';

export type FiltrosPublicos = {
  categoriaId?: number;
  buscar?: string;
  destacados?: boolean;
};

const activos = (tiendaId: TiendaId, f: FiltrosPublicos) => {
  let q = db
    .selectFrom('productos')
    .where('tiendaId', '=', tiendaId)
    .where('activo', '=', true);
  if (f.categoriaId) q = q.where('categoriaId', '=', f.categoriaId);
  if (f.buscar) q = q.where('nombre', 'like', patronContiene(f.buscar));
  if (f.destacados) q = q.where('destacado', '=', true);
  return q;
};

const columnas = [
  'id',
  'nombre',
  'descripcion',
  'precio',
  'stock',
  'stockReservado',
  'agotado',
  'aceptaEncargo',
  'destacado',
  'categoriaId',
] as const;

export const catalogoPublicoRepo = {
  async productos(tiendaId: TiendaId, f: FiltrosPublicos, limite: number, desde: number) {
    const [filas, total] = await Promise.all([
      activos(tiendaId, f)
        .select(columnas)
        .orderBy('nombre')
        .orderBy('id')
        .limit(limite)
        .offset(desde)
        .execute(),
      activos(tiendaId, f)
        .select((eb) => eb.fn.countAll<number>().as('n'))
        .executeTakeFirstOrThrow(),
    ]);
    return { filas, total: Number(total.n) };
  },

  producto: (tiendaId: TiendaId, id: number) =>
    activos(tiendaId, {}).select(columnas).where('id', '=', id).executeTakeFirst(),
};
