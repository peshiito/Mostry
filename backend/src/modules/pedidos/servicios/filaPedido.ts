import type { TiendaId } from '../../../shared/db/tiendaId.js';
import type { DatosCheckout } from '../schemas.js';
import type { calcularTotales } from './totales.js';

const HORA_MS = 60 * 60 * 1000;

// Fila a insertar en pedidos. Un pedido inmediato con pago arranca su plazo
// ahora; un encargo nace "por aceptar" y su seña se pide al aceptarlo (Encargos 2).
export function filaPedido(
  tiendaId: TiendaId,
  d: DatosCheckout,
  totales: ReturnType<typeof calcularTotales>,
  extra: { numero: number; token: string; plazoHoras: number; ahora: Date },
) {
  const { subtotal, descuento, costoEnvio, total, sena, requierePago } = totales;
  const aPagar = requierePago && d.tipo === 'inmediato';
  return {
    tiendaId,
    numero: extra.numero,
    tokenSeguimiento: extra.token,
    tipo: d.tipo,
    estado: aPagar ? ('pendiente_pago' as const) : ('pendiente_confirmacion' as const),
    clienteNombre: d.clienteNombre,
    clienteWhatsapp: d.clienteWhatsapp,
    entrega: d.entrega,
    direccion: d.entrega === 'envio' ? (d.direccion ?? null) : null,
    linkMaps: d.linkMaps ?? null,
    fechaEncargo: d.fechaEncargo ?? null,
    subtotal,
    descuento,
    costoEnvio,
    total,
    sena,
    venceComprobanteEn: aPagar
      ? new Date(extra.ahora.getTime() + extra.plazoHoras * HORA_MS)
      : null,
  };
}
