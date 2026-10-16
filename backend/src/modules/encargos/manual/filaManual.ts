import { tokenAleatorio } from '../../../shared/crypto/tokens.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import type { DatosEncargoManual } from './esquema.js';

type Montos = { subtotal: number; costoEnvio: number; total: number; sena: number };

// Precios del servidor (6.1) y la seña que ya cobró (nunca más que el total).
export function montosManual(
  items: { subtotal: number }[],
  d: DatosEncargoManual,
  costoEnvioTienda: number,
): Montos {
  const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
  const costoEnvio = d.entrega === 'envio' ? costoEnvioTienda : 0;
  const total = subtotal + costoEnvio;
  const sena = d.sena?.monto ?? 0;
  if (sena > total)
    throw new AppError(
      400,
      'sena_mayor_al_total',
      'La seña no puede ser más que el total.',
    );
  return { subtotal, costoEnvio, total, sena };
}

// Fila del encargo cargado desde el panel: ya aceptado. Con la seña cobrada
// queda como pago aprobado; sin seña, confirmado. Tiene link de seguimiento.
export const filaManual = (
  tiendaId: TiendaId,
  numero: number,
  d: DatosEncargoManual,
  m: Montos,
) => ({
  tiendaId,
  numero,
  tokenSeguimiento: tokenAleatorio(),
  tipo: 'encargo' as const,
  origen: 'panel' as const,
  estado: m.sena > 0 ? ('pago_aprobado' as const) : ('confirmado' as const),
  clienteNombre: d.clienteNombre,
  clienteWhatsapp: d.clienteWhatsapp,
  entrega: d.entrega,
  direccion: d.entrega === 'envio' ? (d.direccion ?? null) : null,
  linkMaps: null,
  fechaEncargo: d.fechaEncargo,
  descuento: 0,
  venceComprobanteEn: null,
  ...m,
});
