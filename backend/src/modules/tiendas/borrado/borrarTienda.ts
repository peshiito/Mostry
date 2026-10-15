import { sql } from 'kysely';
import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { borrarCuentaSiQuedaSola } from './cuentaDueno.js';
import { TABLAS_DE_TIENDA } from './tablasDeTienda.js';

// Borra de verdad una tienda con todos sus datos y, si el dueño no tiene otra,
// también su cuenta. Siempre dentro de una transacción (tx). Lo usan el admin
// (eliminar una tienda suspendida) y el registro (liberar uno que nunca se
// verificó). Los archivos del bucket los encola quien llama.
export async function borrarTiendaEnTx(
  tx: Ejecutor,
  tiendaId: TiendaId,
  duenoId: number,
) {
  for (const tabla of TABLAS_DE_TIENDA) {
    await sql`DELETE FROM ${sql.table(tabla)} WHERE tienda_id = ${tiendaId}`.execute(tx);
  }
  const cuentaBorrada = await borrarCuentaSiQuedaSola(tx, duenoId);
  await tx.deleteFrom('tiendas').where('id', '=', tiendaId).execute();
  return { cuentaBorrada };
}
