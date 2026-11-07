import { z } from 'zod';
import { hmac, igualesSeguro } from '../../../shared/crypto/tokens.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';

const DURA_MS = 24 * 60 * 60 * 1000;
const firma = (tiendaId: TiendaId, vence: number) =>
  hmac(`pagina-borrador:${tiendaId}:${vence}`);

// "Mirala en tu celu": un link al borrador para el dueño. Lleva un token firmado
// para ESTA tienda que vence en 24 h; sin él, el comprador ve lo publicado.
export function firmarVistaBorrador(tiendaId: TiendaId, ahora = Date.now()) {
  const vence = ahora + DURA_MS;
  return { token: `${vence}.${firma(tiendaId, vence)}`, vence: new Date(vence) };
}

export const esquemaTokenBorrador = z
  .string()
  .max(90)
  .regex(/^\d{1,16}\.[a-f0-9]{64}$/);

// ¿El token sirve para esta tienda y todavía no venció?
export function leerVistaBorrador(
  tiendaId: TiendaId,
  token: unknown,
  ahora = Date.now(),
) {
  const ok = esquemaTokenBorrador.safeParse(token);
  if (!ok.success) return false;
  const [vence, f] = ok.data.split('.');
  const hasta = Number(vence);
  if (!Number.isSafeInteger(hasta) || hasta < ahora) return false;
  return igualesSeguro(f!, firma(tiendaId, hasta));
}
