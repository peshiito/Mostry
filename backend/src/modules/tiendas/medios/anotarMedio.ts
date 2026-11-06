import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';

export const MAX_MEDIOS = 60;
export const MAX_BYTES_TIENDA = 150 * 1024 * 1024;

type Nuevo = {
  clave: string;
  tipo: 'foto' | 'animado';
  ancho: number;
  alto: number;
  bytes: number;
};

// Anota el medio con la tienda bloqueada: dos subidas a la vez no pasan los topes.
export function anotarMedio(tiendaId: TiendaId, m: Nuevo) {
  return db.transaction().execute(async (tx) => {
    await tx
      .selectFrom('tiendas')
      .select('id')
      .where('id', '=', tiendaId)
      .forUpdate()
      .execute();
    const uso = await tx
      .selectFrom('mediosTienda')
      .select((eb) => [
        eb.fn.countAll<number>().as('n'),
        eb.fn.sum<number>('bytes').as('b'),
      ])
      .where('tiendaId', '=', tiendaId)
      .executeTakeFirstOrThrow();
    if (Number(uso.n) >= MAX_MEDIOS)
      throw new AppError(
        409,
        'medios_llenos',
        `Podés tener hasta ${MAX_MEDIOS} imágenes. Borrá alguna que no uses.`,
      );
    if (Number(uso.b ?? 0) + m.bytes > MAX_BYTES_TIENDA)
      throw new AppError(
        409,
        'medios_llenos',
        'Ya no queda lugar para imágenes. Borrá alguna que no uses.',
      );
    const r = await tx
      .insertInto('mediosTienda')
      .values({ tiendaId, ...m })
      .executeTakeFirstOrThrow();
    return { id: Number(r.insertId), tipo: m.tipo };
  });
}
