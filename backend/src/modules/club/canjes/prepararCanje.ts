import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { programaVigente } from '../sellos/programaVigente.js';
import { saldoDe } from '../sellos/saldo.js';
import { calcularDescuento } from './calcularDescuento.js';

export type CanjePreparado = Awaited<ReturnType<typeof prepararCanje>>;

const error = (codigo: string, texto: string) => new AppError(409, codigo, texto);

// Bloquea el programa de la tienda: dos canjes a la vez se ponen en fila. Tiene
// que ser la PRIMERA consulta de la transacción: con REPEATABLE READ, la foto
// de los datos se toma en la primera lectura común; si fuera antes del lock, el
// segundo canje no vería el primero y gastaría los mismos sellos.
export const bloquearPrograma = (tx: Ejecutor, tiendaId: TiendaId) =>
  tx
    .selectFrom('programasLealtad')
    .select('tiendaId')
    .where('tiendaId', '=', tiendaId)
    .forUpdate()
    .execute();

// Antes de cobrar (con el programa ya bloqueado): revisa que le alcancen los
// sellos y calcula el descuento sobre los productos.
export async function prepararCanje(
  tx: Ejecutor,
  tiendaId: TiendaId,
  clienteId: number,
  compras: number,
  subtotal: number,
) {
  const programa = await programaVigente(tiendaId, tx);
  if (!programa) throw error('club_apagado', 'Esta tienda no tiene el club prendido.');
  const premio = await tx
    .selectFrom('premiosLealtad')
    .select(['compras', 'tipo', 'valor', 'tope', 'descripcion'])
    .where('tiendaId', '=', tiendaId)
    .where('compras', '=', compras)
    .executeTakeFirst();
  if (!premio) throw error('premio_inexistente', 'Ese premio ya no existe.');
  const sellos = await saldoDe(tiendaId, clienteId, programa.venceMeses, new Date(), tx);
  if (sellos < compras)
    throw error('sellos_insuficientes', 'Todavía no te alcanzan los sellos.');
  const ultimo = await tx
    .selectFrom('sellos')
    .select((eb) => eb.fn.max('id').as('id'))
    .where('tiendaId', '=', tiendaId)
    .where('clienteId', '=', clienteId)
    .executeTakeFirstOrThrow();
  return {
    clienteId,
    premio,
    hastaSelloId: Number(ultimo.id),
    descuento: calcularDescuento(premio, subtotal),
  };
}
