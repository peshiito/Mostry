import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { programaVigente } from './programaVigente.js';

type Compra = {
  clienteId: number;
  origen: 'pedido' | 'venta';
  origenId: number;
  monto: number;
};

// Suma un sello por la compra si el club está prendido y llega al mínimo.
// INSERT IGNORE: la misma compra nunca suma dos veces. Devuelve si sumó.
export async function sumarSello(ej: Ejecutor, tiendaId: TiendaId, c: Compra) {
  const programa = await programaVigente(tiendaId, ej);
  if (!programa || c.monto < programa.compraMinima) return false;
  const r = await ej
    .insertInto('sellos')
    .ignore()
    .values({ tiendaId, ...c })
    .executeTakeFirst();
  return Number(r.numInsertedOrUpdatedRows ?? 0) > 0;
}
