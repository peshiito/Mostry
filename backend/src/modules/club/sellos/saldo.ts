import { db } from '../../../shared/db/db.js';
import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';

// Desde cuándo cuentan los sellos: si la tienda puso vencimiento, los más
// viejos que eso ya no valen.
export function desdeFecha(venceMeses: number | null, ahora = new Date()) {
  if (!venceMeses) return null;
  const d = new Date(ahora);
  d.setUTCMonth(d.getUTCMonth() - venceMeses);
  return d;
}

// Los sellos que tiene un cliente en una tienda. Se calcula, no se guarda:
// cuentan los no vencidos y posteriores al último sello gastado en un premio.
export async function saldoDe(
  tiendaId: TiendaId,
  clienteId: number,
  venceMeses: number | null,
  ahora = new Date(),
  ej: Ejecutor = db,
) {
  const desde = desdeFecha(venceMeses, ahora);
  const gastado = await ultimoSelloGastado(tiendaId, clienteId, ej);
  const fila = await ej
    .selectFrom('sellos')
    .select((eb) => eb.fn.countAll<number>().as('n'))
    .where('tiendaId', '=', tiendaId)
    .where('clienteId', '=', clienteId)
    .where('id', '>', gastado)
    .$if(desde !== null, (q) => q.where('creadoEn', '>', desde!))
    .executeTakeFirstOrThrow();
  return Number(fila.n);
}

// Hasta qué sello se gastó con premios (0 = ninguno). Los canjes anulados
// (pedido cancelado) no cuentan: sus sellos vuelven.
export async function ultimoSelloGastado(
  tiendaId: TiendaId,
  clienteId: number,
  ej: Ejecutor = db,
): Promise<number> {
  const fila = await ej
    .selectFrom('canjes')
    .select((eb) => eb.fn.max('hastaSelloId').as('hasta'))
    .where('tiendaId', '=', tiendaId)
    .where('clienteId', '=', clienteId)
    .where('anuladoEn', 'is', null)
    .executeTakeFirstOrThrow();
  return Number(fila.hasta ?? 0);
}
