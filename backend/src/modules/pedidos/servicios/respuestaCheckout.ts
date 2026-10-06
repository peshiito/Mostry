import type { TiendaParaPedido } from '../repositorios/tiendaParaPedido.repository.js';
import type { filaPedido } from './filaPedido.js';
import { montoAPagar } from './montos.js';
import { urlSeguimiento } from './urlSeguimiento.js';

// Lo que necesita la pantalla "Pago": número, link de seguimiento y a dónde transferir.
export function respuestaCheckout(
  t: TiendaParaPedido,
  pedido: ReturnType<typeof filaPedido>,
) {
  return {
    numero: pedido.numero,
    token: pedido.tokenSeguimiento,
    estado: pedido.estado,
    total: pedido.total,
    sena: pedido.sena,
    venceComprobanteEn: pedido.venceComprobanteEn,
    seguimiento: urlSeguimiento(t.slug, pedido.tokenSeguimiento),
    pago:
      pedido.estado === 'pendiente_pago'
        ? { alias: t.alias, titular: t.titularAlias, monto: montoAPagar(pedido) }
        : null,
  };
}
