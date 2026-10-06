import type { Insertable } from 'kysely';
import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import type { MovimientosCajaTabla } from '../../../shared/db/tipos/caja.js';

const columnas = [
  'id',
  'cajaId',
  'tipo',
  'medio',
  'monto',
  'concepto',
  'origen',
  'origenId',
  'fecha',
] as const;

export const movimientosRepo = {
  insertar: (tx: Ejecutor, fila: Insertable<MovimientosCajaTabla>) =>
    tx.insertInto('movimientosCaja').values(fila).execute(),

  deCaja: (tiendaId: TiendaId, cajaId: number, ej: Ejecutor = db) =>
    ej
      .selectFrom('movimientosCaja')
      .select(columnas)
      .where('tiendaId', '=', tiendaId)
      .where('cajaId', '=', cajaId)
      .orderBy('fecha')
      .orderBy('id')
      .execute(),

  // Movimientos entre dos instantes (para el resumen de un período).
  entre: (tiendaId: TiendaId, desde: Date, hasta: Date) =>
    db
      .selectFrom('movimientosCaja')
      .select(columnas)
      .where('tiendaId', '=', tiendaId)
      .where('fecha', '>=', desde)
      .where('fecha', '<', hasta)
      .orderBy('fecha', 'desc')
      .orderBy('id', 'desc')
      .execute(),
};

export type Movimiento = Awaited<ReturnType<typeof movimientosRepo.deCaja>>[number];
