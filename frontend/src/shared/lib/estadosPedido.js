// Estados del pedido (6.1 y decisión del encargo sin seña) con su texto y tono.
export const ESTADOS = {
  pendiente_pago: { texto: 'Pendiente de pago', tono: 'mostaza' },
  comprobante_enviado: { texto: 'Comprobante enviado', tono: 'mostaza' },
  pago_aprobado: { texto: 'Pago aprobado', tono: 'ok' },
  pendiente_confirmacion: { texto: 'Pendiente de confirmación', tono: 'mostaza' },
  confirmado: { texto: 'Confirmado', tono: 'ok' },
  en_preparacion: { texto: 'En preparación', tono: 'verde' },
  en_camino: { texto: 'En camino', tono: 'verde' },
  listo_retirar: { texto: 'Listo para retirar', tono: 'verde' },
  entregado: { texto: 'Entregado', tono: 'gris' },
  cancelado: { texto: 'Cancelado', tono: 'ladrillo' },
};

// Recorrido que ve el comprador, según tipo de pedido y entrega.
export function recorrido(pedido) {
  const final = pedido.entrega === 'envio' ? 'en_camino' : 'listo_retirar';
  const inicio =
    pedido.tipo === 'encargo' && !pedido.sena
      ? ['pendiente_confirmacion', 'confirmado']
      : ['pendiente_pago', 'comprobante_enviado', 'pago_aprobado'];
  return [...inicio, 'en_preparacion', final, 'entregado'];
}
