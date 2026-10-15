import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import type { Compra } from './pedidos.js';
import type { Sesion } from './sesion.js';

// La comerciante aprueba el comprobante con los datos de la transferencia.
export async function aprobar(
  rosa: Sesion,
  tiendaId: TiendaId,
  c: Compra,
  titular: string,
) {
  const id = await idPedido(tiendaId, c.numero);
  const [comp] = (await rosa.get(`/panel/pedidos/${id}/comprobantes`)) as {
    id: number;
  }[];
  await rosa.post(`/panel/pedidos/${id}/comprobantes/${comp!.id}/aprobar`, {
    // Un encargo no trae el pago al crearse: se pide al aceptarlo (Encargos 2).
    monto: c.pago?.monto ?? c.sena,
    fechaOperacion: new Date().toISOString(),
    titular,
    numeroOperacion: String(400_000_000 + c.numero), // inventado, pero siempre igual
  });
  return id;
}

export async function idPedido(tiendaId: TiendaId, numero: number) {
  const p = await db
    .selectFrom('pedidos')
    .select('id')
    .where('tiendaId', '=', tiendaId)
    .where('numero', '=', numero)
    .executeTakeFirstOrThrow();
  return p.id;
}
