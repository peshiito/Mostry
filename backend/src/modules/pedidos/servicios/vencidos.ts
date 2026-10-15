import { db } from '../../../shared/db/db.js';
import type { Pedido } from '../repositorios/pedidos.repository.js';

const LOTE = 200;

// Por qué se cancela un pedido, o null si (ya) no corresponde. Se re-chequea con
// el pedido bloqueado: si el comprador pagó o lo aceptaron entre medio, no se toca.
export function motivo(p: Pedido | undefined, ahora: Date) {
  if (
    p?.estado === 'pendiente_pago' &&
    p.venceComprobanteEn &&
    p.venceComprobanteEn <= ahora
  )
    return 'Venció el plazo para pagar';
  // Encargos 2: un encargo que nadie aceptó no espera para siempre.
  if (
    p?.estado === 'pendiente_confirmacion' &&
    p.tipo === 'encargo' &&
    p.fechaEncargo &&
    p.fechaEncargo <= ahora
  )
    return 'Pasó la fecha sin que la tienda lo aceptara';
  return null;
}

export const candidatos = (ahora: Date) =>
  db
    .selectFrom('pedidos')
    .select(['id', 'tiendaId'])
    .where((eb) =>
      eb.or([
        eb.and([
          eb('estado', '=', 'pendiente_pago'),
          eb('venceComprobanteEn', '<=', ahora),
        ]),
        eb.and([
          eb('estado', '=', 'pendiente_confirmacion'),
          eb('tipo', '=', 'encargo'),
          eb('fechaEncargo', '<=', ahora),
        ]),
      ]),
    )
    .orderBy('id')
    .limit(LOTE)
    .execute();
