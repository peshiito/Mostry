import { sql } from 'kysely';
import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';

// Correlativo de ventas por tienda sin carreras (igual que el número de pedido):
// LAST_INSERT_ID(expr) queda en la conexión de la transacción.
export async function siguienteNumeroVenta(
  tx: Ejecutor,
  tiendaId: TiendaId,
): Promise<number> {
  await tx
    .updateTable('tiendas')
    .set({ ultimoNumeroVenta: sql`LAST_INSERT_ID(ultimo_numero_venta + 1)` })
    .where('id', '=', tiendaId)
    .executeTakeFirstOrThrow();
  const { rows } = await sql<{ n: number }>`SELECT LAST_INSERT_ID() AS n`.execute(tx);
  return Number(rows[0]!.n);
}
