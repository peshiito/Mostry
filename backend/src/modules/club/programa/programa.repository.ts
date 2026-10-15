import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import type { PremioNuevo, ProgramaNuevo } from './schemas.js';

const columnasPremio = ['compras', 'tipo', 'valor', 'tope', 'descripcion'] as const;

// La fila de un escalón: los campos que su tipo no usa van en null.
const filaPremio = (tiendaId: TiendaId, p: PremioNuevo) => ({
  tiendaId,
  compras: p.compras,
  tipo: p.tipo,
  valor: p.tipo === 'regalo' ? null : p.valor,
  tope: p.tipo === 'porcentaje' ? p.tope : null,
  descripcion: p.descripcion || null,
});

// Toda consulta recibe el tiendaId: una tienda nunca ve el programa de otra.
export const programaRepo = {
  buscar: (tiendaId: TiendaId) =>
    db
      .selectFrom('programasLealtad')
      .select(['nombre', 'compraMinima', 'venceMeses'])
      .where('tiendaId', '=', tiendaId)
      .executeTakeFirst(),

  premios: (tiendaId: TiendaId) =>
    db
      .selectFrom('premiosLealtad')
      .select(columnasPremio)
      .where('tiendaId', '=', tiendaId)
      .orderBy('compras')
      .execute(),

  // Guarda todo junto: el programa y sus escalones (los reemplaza enteros).
  guardar: (tiendaId: TiendaId, p: ProgramaNuevo) =>
    db.transaction().execute(async (tx) => {
      const datos = {
        nombre: p.nombre,
        compraMinima: p.compraMinima,
        venceMeses: p.venceMeses,
      };
      await tx
        .insertInto('programasLealtad')
        .values({ tiendaId, ...datos })
        .onDuplicateKeyUpdate(datos)
        .execute();
      await tx.deleteFrom('premiosLealtad').where('tiendaId', '=', tiendaId).execute();
      await tx
        .insertInto('premiosLealtad')
        .values(p.premios.map((x) => filaPremio(tiendaId, x)))
        .execute();
    }),

  tienda: (tiendaId: TiendaId) =>
    db
      .selectFrom('tiendas')
      .select(['usaClub', 'nombre'])
      .where('id', '=', tiendaId)
      .executeTakeFirstOrThrow(),

  prender: (tiendaId: TiendaId, usaClub: boolean) =>
    db.updateTable('tiendas').set({ usaClub }).where('id', '=', tiendaId).execute(),
};
