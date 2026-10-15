import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { prepararCanje, type CanjePreparado } from '../../club/canjes/prepararCanje.js';
import { registrarCanje } from '../../club/canjes/registrarCanje.js';
import { sumarSello } from '../../club/sellos/sumarSello.js';

// Antes de cobrar: si pidió usar un premio, lo prepara (bloquea el programa y
// calcula el descuento). Sin cliente del club identificado no hay premio.
export async function premioDeVenta(
  tx: Ejecutor,
  tiendaId: TiendaId,
  clienteId: number | null,
  premio: number | undefined,
  total: number,
) {
  if (premio === undefined) return null;
  if (!clienteId)
    throw new AppError(400, 'sin_cliente', 'Identificá al cliente del club primero.');
  return prepararCanje(tx, tiendaId, clienteId, premio, total);
}

// Después de cobrar: anota el canje y suma el sello por lo que pagó.
export async function cerrarClubDeVenta(
  tx: Ejecutor,
  tiendaId: TiendaId,
  clienteId: number | null,
  canje: CanjePreparado | null,
  venta: { id: number; cobrado: number },
) {
  if (canje) await registrarCanje(tx, tiendaId, canje, 'venta', venta.id);
  if (!clienteId) return false;
  return sumarSello(tx, tiendaId, {
    clienteId,
    origen: 'venta',
    origenId: venta.id,
    monto: venta.cobrado,
  });
}
