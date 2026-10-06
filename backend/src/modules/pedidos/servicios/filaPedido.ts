import type { TiendaId } from '../../../shared/db/tiendaId.js';
import type { DatosCheckout } from '../schemas.js';
import type { calcularTotales } from './totales.js';

const HORA_MS = 60 * 60 * 1000;

// Fila a insertar en pedidos. El plazo para el comprobante arranca ahora.
export function filaPedido(
  tiendaId: TiendaId,
  d: DatosCheckout,
  totales: ReturnType<typeof calcularTotales>,
  extra: { numero: number; token: string; plazoHoras: number; ahora: Date },
) {
  const { subtotal, costoEnvio, total, sena, requierePago } = totales;
  return {
    tiendaId,
    numero: extra.numero,
    tokenSeguimiento: extra.token,
    tipo: d.tipo,
    estado: requierePago
      ? ('pendiente_pago' as const)
      : ('pendiente_confirmacion' as const),
    clienteNombre: d.clienteNombre,
    clienteWhatsapp: d.clienteWhatsapp,
    entrega: d.entrega,
    direccion: d.entrega === 'envio' ? (d.direccion ?? null) : null,
    linkMaps: d.linkMaps ?? null,
    fechaEncargo: d.fechaEncargo ?? null,
    subtotal,
    costoEnvio,
    total,
    sena,
    venceComprobanteEn: requierePago
      ? new Date(extra.ahora.getTime() + extra.plazoHoras * HORA_MS)
      : null,
  };
}
