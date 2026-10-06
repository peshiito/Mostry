import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import type { EstadoPedido } from '../../../shared/db/tipos/pedidos.js';

export type FiltrosPedidos = { estado?: EstadoPedido; tipo?: 'inmediato' | 'encargo' };
const resumen = [
  'id',
  'numero',
  'estado',
  'tipo',
  'clienteNombre',
  'total',
  'sena',
  'entrega',
  'fechaEncargo',
  'venceComprobanteEn',
  'creadoEn',
] as const;

const filtrados = (tiendaId: TiendaId, f: FiltrosPedidos) => {
  let q = db.selectFrom('pedidos').where('tiendaId', '=', tiendaId);
  if (f.estado) q = q.where('estado', '=', f.estado);
  if (f.tipo) q = q.where('tipo', '=', f.tipo);
  return q;
};

// Lista del panel, más nuevos primero.
export async function listarPedidosRepo(
  tiendaId: TiendaId,
  f: FiltrosPedidos,
  limite: number,
  desde: number,
) {
  const [filas, total] = await Promise.all([
    filtrados(tiendaId, f)
      .select(resumen)
      .orderBy('creadoEn', 'desc')
      .orderBy('id', 'desc')
      .limit(limite)
      .offset(desde)
      .execute(),
    filtrados(tiendaId, f)
      .select((eb) => eb.fn.countAll<number>().as('n'))
      .executeTakeFirstOrThrow(),
  ]);
  return { filas, total: Number(total.n) };
}
