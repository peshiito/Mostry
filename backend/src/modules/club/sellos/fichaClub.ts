import { hmac, igualesSeguro } from '../../../shared/crypto/tokens.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';

const DURA_MS = 30 * 60 * 1000;
const firma = (tiendaId: TiendaId, clienteId: number, vence: number) =>
  hmac(`club-ficha:${tiendaId}:${clienteId}:${vence}`);

// Al identificar al cliente en el local, el servidor entrega una ficha firmada
// (para esta tienda, 30 minutos). La venta la devuelve al cobrar: así el código
// del QR puede rotar mientras cargan los productos, y el navegador nunca manda
// un id que el servidor no haya firmado.
export function firmarFicha(tiendaId: TiendaId, clienteId: number, ahora = Date.now()) {
  const vence = ahora + DURA_MS;
  return `${clienteId}.${vence}.${firma(tiendaId, clienteId, vence)}`;
}

// El cliente de una ficha válida para esta tienda, o null.
export function leerFicha(tiendaId: TiendaId, ficha: string, ahora = Date.now()) {
  const [id, vence, f] = ficha.split('.');
  const clienteId = Number(id);
  const hasta = Number(vence);
  if (!Number.isSafeInteger(clienteId) || !Number.isSafeInteger(hasta) || !f) return null;
  if (hasta < ahora) return null;
  return igualesSeguro(f, firma(tiendaId, clienteId, hasta)) ? clienteId : null;
}
