import type { EstadoPedido } from '../../../shared/db/tipos/pedidos.js';

// Flujo (CLAUDE.md 6.1 y decisión de encargos sin seña):
//   con pago:  pendiente_pago → comprobante_enviado → pago_aprobado → en_preparacion
//   sin seña:  pendiente_confirmacion → confirmado → en_preparacion
//   y después: en_preparacion → en_camino | listo_retirar → entregado
// comprobante_enviado y pago_aprobado los ponen el comprobante y su aprobación,
// no el comerciante a mano. cancelado se maneja aparte.
export type EstadoManual =
  'confirmado' | 'en_preparacion' | 'en_camino' | 'listo_retirar' | 'entregado';

export const TRANSICIONES_MANUALES: Readonly<
  Record<EstadoManual, readonly EstadoPedido[]>
> = {
  confirmado: ['pendiente_confirmacion'],
  en_preparacion: ['pago_aprobado', 'confirmado'],
  en_camino: ['en_preparacion'],
  listo_retirar: ['en_preparacion'],
  entregado: ['en_camino', 'listo_retirar'],
};

export const ESTADOS_FINALES: readonly EstadoPedido[] = ['entregado', 'cancelado'];

// Mientras está en estos estados, un pedido inmediato tiene stock RESERVADO.
export const CON_RESERVA: readonly EstadoPedido[] = [
  'pendiente_pago',
  'comprobante_enviado',
];

// En estos estados el stock de un pedido inmediato ya se DESCONTÓ (pago aprobado).
export const CON_STOCK_DESCONTADO: readonly EstadoPedido[] = [
  'pago_aprobado',
  'en_preparacion',
  'en_camino',
  'listo_retirar',
];
