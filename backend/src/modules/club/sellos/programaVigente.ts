import { db } from '../../../shared/db/db.js';
import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';

// El programa de la tienda si el club está prendido (si no, null: no se suman
// sellos ni se canjean premios, aunque los sellos viejos sigan guardados).
export const programaVigente = (tiendaId: TiendaId, ej: Ejecutor = db) =>
  ej
    .selectFrom('tiendas')
    .innerJoin('programasLealtad', 'programasLealtad.tiendaId', 'tiendas.id')
    .select(['programasLealtad.compraMinima', 'programasLealtad.venceMeses'])
    .where('tiendas.id', '=', tiendaId)
    .where('tiendas.usaClub', '=', true)
    .executeTakeFirst();

export type ProgramaVigente = NonNullable<Awaited<ReturnType<typeof programaVigente>>>;
