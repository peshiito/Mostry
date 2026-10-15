import { urlFirmada, VIGENCIA_URL_S } from '../../../shared/archivos/privado.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { itemDelPedido, itemNoEncontrado } from './itemDelPedido.js';

// URL firmada de 5 minutos para ver la foto de referencia. Solo miembros de la
// tienda (la ruta pasa por accesoPanel) y solo mientras exista.
export async function verFotoReferencia(
  tiendaId: TiendaId,
  pedidoId: number,
  itemId: number,
) {
  const item = await itemDelPedido(tiendaId, pedidoId, itemId);
  if (!item) throw itemNoEncontrado();
  if (!item.fotoClave)
    throw new AppError(
      404,
      'foto_no_encontrada',
      'Ese producto no tiene foto (o ya se borró).',
    );
  const url = await urlFirmada(
    item.fotoClave,
    `referencia-${pedidoId}-${itemId}.webp`,
    true,
  );
  return { url, venceEn: new Date(Date.now() + VIGENCIA_URL_S * 1000) };
}
