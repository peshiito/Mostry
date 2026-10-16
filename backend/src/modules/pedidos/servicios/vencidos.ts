import { sql } from 'kysely';
import { db } from '../../../shared/db/db.js';
import type { Pedido } from '../repositorios/pedidos.repository.js';

const LOTE = 200;
const HORA_MS = 60 * 60 * 1000;

// Por qué se cancela un pedido, o null si (ya) no corresponde. Se re-chequea con
// el pedido bloqueado: si el comprador pagó o lo aceptaron entre medio, no se toca.
// `plazoHoras` es el plazo del comprobante de la tienda.
export function motivo(p: Pedido | undefined, ahora: Date, plazoHoras: number) {
  if (
    p?.estado === 'pendiente_pago' &&
    p.venceComprobanteEn &&
    p.venceComprobanteEn <= ahora
  )
    return 'Venció el plazo para pagar';
  if (p?.estado !== 'pendiente_confirmacion') return null;
  // Encargos 2: un encargo que nadie aceptó no espera para siempre.
  if (p.tipo === 'encargo' && p.fechaEncargo && p.fechaEncargo <= ahora)
    return 'Pasó la fecha sin que la tienda lo aceptara';
  // S1: un pedido gratis del Club tiene el mismo plazo que un comprobante.
  if (
    p.tipo === 'inmediato' &&
    p.creadoEn.getTime() + plazoHoras * HORA_MS <= ahora.getTime()
  )
    return 'Nadie confirmó el pedido a tiempo';
  return null;
}

export const candidatos = (ahora: Date) =>
  db
    .selectFrom('pedidos')
    .innerJoin('tiendas', 'tiendas.id', 'pedidos.tiendaId')
    .select(['pedidos.id', 'pedidos.tiendaId', 'tiendas.plazoComprobanteHoras'])
    .where((eb) =>
      eb.or([
        eb.and([
          eb('pedidos.estado', '=', 'pendiente_pago'),
          eb('pedidos.venceComprobanteEn', '<=', ahora),
        ]),
        eb.and([
          eb('pedidos.estado', '=', 'pendiente_confirmacion'),
          eb('pedidos.tipo', '=', 'encargo'),
          eb('pedidos.fechaEncargo', '<=', ahora),
        ]),
        eb.and([
          eb('pedidos.estado', '=', 'pendiente_confirmacion'),
          eb('pedidos.tipo', '=', 'inmediato'),
          eb(
            'pedidos.creadoEn',
            '<=',
            sql<Date>`DATE_SUB(${ahora}, INTERVAL tiendas.plazo_comprobante_horas HOUR)`,
          ),
        ]),
      ]),
    )
    .orderBy('pedidos.id')
    .limit(LOTE)
    .execute();
