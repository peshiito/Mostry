import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { bloquearPrograma, prepararCanje } from '../../club/canjes/prepararCanje.js';
import type { DatosCheckout } from '../schemas.js';

// Con premio, el programa se bloquea como PRIMERA consulta de la transacción.
export const bloquearSiHayPremio = (
  tx: Ejecutor,
  tiendaId: TiendaId,
  d: DatosCheckout,
) => (d.premio === undefined ? undefined : bloquearPrograma(tx, tiendaId));

// Si el comprador pidió usar un premio del Club: tiene que haber entrado con
// su cuenta (la cookie del club) y le tienen que alcanzar los sellos.
export async function canjeDelPedido(
  tx: Ejecutor,
  tiendaId: TiendaId,
  d: DatosCheckout,
  clienteId: number | null,
  items: { subtotal: number }[],
) {
  if (d.premio === undefined) return null;
  if (!clienteId)
    throw new AppError(401, 'sin_sesion', 'Entrá al Club para usar tu premio.');
  const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
  return prepararCanje(tx, tiendaId, clienteId, d.premio, subtotal);
}
