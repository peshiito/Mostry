import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import { db } from '../../../shared/db/db.js';
import { idInsertado } from '../../../shared/db/idInsertado.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';

const columnas = [
  'id',
  'fecha',
  'montoApertura',
  'abiertaEn',
  'cerradaEn',
  'montoContado',
  'diferencia',
] as const;

// Toda función exige tiendaId (sección 4.1).
export const cajasRepo = {
  // La caja sin cerrar (como mucho hay una). Con tx, la bloquea.
  abierta: (tiendaId: TiendaId, tx?: Ejecutor) => {
    const q = (tx ?? db)
      .selectFrom('cajas')
      .select(columnas)
      .where('tiendaId', '=', tiendaId)
      .where('cerradaEn', 'is', null);
    return (tx ? q.forUpdate() : q).executeTakeFirst();
  },

  delDia: (tiendaId: TiendaId, fecha: string) =>
    db
      .selectFrom('cajas')
      .select(columnas)
      .where('tiendaId', '=', tiendaId)
      .where('fecha', '=', fecha)
      .executeTakeFirst(),

  async crear(tiendaId: TiendaId, fecha: string, montoApertura: number) {
    const fila = { tiendaId, fecha, montoApertura, abiertaEn: new Date() };
    return idInsertado(
      await db.insertInto('cajas').values(fila).executeTakeFirstOrThrow(),
    );
  },

  cerrar: (
    tx: Ejecutor,
    tiendaId: TiendaId,
    id: number,
    montoContado: number,
    diferencia: number,
  ) =>
    tx
      .updateTable('cajas')
      .set({ cerradaEn: new Date(), montoContado, diferencia })
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', id)
      .execute(),

  historial: (tiendaId: TiendaId, limite: number) =>
    db
      .selectFrom('cajas')
      .select(columnas)
      .where('tiendaId', '=', tiendaId)
      .orderBy('fecha', 'desc')
      .limit(limite)
      .execute(),
};

export type Caja = NonNullable<Awaited<ReturnType<typeof cajasRepo.abierta>>>;
