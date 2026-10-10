import { sql } from 'kysely';
import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import type { Sesion } from './sesion.js';

const mov = (tipo: string, medio: string, monto: number, concepto: string) => ({
  tipo,
  medio,
  monto,
  concepto,
});

// Caja de ayer (cerrada con $500 de diferencia) y caja de hoy abierta con
// movimientos. La de ayer se arma hoy y después se corre un día para atrás.
export async function escenaCaja(rosa: Sesion, tiendaId: TiendaId) {
  await rosa.post('/panel/caja/abrir', { montoApertura: 2_000_000 });
  await rosa.post(
    '/panel/caja/movimientos',
    mov('ingreso', 'efectivo', 850_000, 'Ventas de mostrador'),
  );
  await rosa.post(
    '/panel/caja/movimientos',
    mov('egreso', 'efectivo', 120_000, 'Bolsas y cajas de torta'),
  );
  await rosa.post('/panel/caja/cerrar', { montoContado: 2_680_000 }); // esperaba 2.730.000
  const ayer = await db
    .selectFrom('cajas')
    .select('id')
    .where('tiendaId', '=', tiendaId)
    .orderBy('id', 'desc')
    .executeTakeFirstOrThrow();
  await db
    .updateTable('cajas')
    .set({
      fecha: sql`fecha - INTERVAL 1 DAY`,
      abiertaEn: sql`abierta_en - INTERVAL 1 DAY`,
      cerradaEn: sql`cerrada_en - INTERVAL 1 DAY`,
    })
    .where('tiendaId', '=', tiendaId)
    .where('id', '=', ayer.id)
    .execute();
  await db
    .updateTable('movimientosCaja')
    .set({ fecha: sql`fecha - INTERVAL 1 DAY` })
    .where('tiendaId', '=', tiendaId)
    .where('cajaId', '=', ayer.id)
    .execute();

  await rosa.post('/panel/caja/abrir', { montoApertura: 1_500_000 });
  await rosa.post(
    '/panel/caja/movimientos',
    mov('ingreso', 'efectivo', 640_000, 'Venta de mostrador: facturas'),
  );
  await rosa.post(
    '/panel/caja/movimientos',
    mov('ingreso', 'transferencia', 420_000, 'Docena por transferencia'),
  );
}
