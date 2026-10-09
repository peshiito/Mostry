import { sql } from 'kysely';
import { db } from '../../shared/db/db.js';
import type { Ejecutor } from '../../shared/db/ejecutor.js';
import type { TiendaId } from '../../shared/db/tiendaId.js';

type Nuevo = {
  usuarioId: number;
  pantalla: string;
  descripcion: string;
  navegador: string | null;
};

// Reportes de UNA tienda (lado comercio): siempre con tiendaId.
export const reportesRepo = {
  async crear(tx: Ejecutor, tiendaId: TiendaId, datos: Nuevo) {
    // Bloquea la fila de la tienda: dos reportes a la vez no repiten número.
    await tx
      .selectFrom('tiendas')
      .select('id')
      .where('id', '=', tiendaId)
      .forUpdate()
      .execute();
    const { ultimo } = await tx
      .selectFrom('reportes')
      .select(sql<number>`COALESCE(MAX(numero), 0)`.as('ultimo'))
      .where('tiendaId', '=', tiendaId)
      .executeTakeFirstOrThrow();
    const numero = Number(ultimo) + 1;
    const r = await tx
      .insertInto('reportes')
      .values({ tiendaId, numero, ...datos })
      .executeTakeFirstOrThrow();
    return { id: Number(r.insertId), numero };
  },

  listar: (tiendaId: TiendaId) =>
    db
      .selectFrom('reportes')
      .select([
        'id',
        'numero',
        'pantalla',
        'descripcion',
        'estado',
        'respuesta',
        'creadoEn',
      ])
      .select((eb) => eb('claveCaptura', 'is not', null).as('conCaptura'))
      .where('tiendaId', '=', tiendaId)
      .orderBy('id', 'desc')
      .limit(50)
      .execute(),
};
