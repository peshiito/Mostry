// Próximo paso del pedido según su estado (botón coral del detalle).
export function accionPrincipal(p) {
  switch (p.estado) {
    case 'comprobante_enviado':
      return { texto: 'Revisar comprobante', ruta: `/panel/pedidos/${p.id}/comprobante` };
    case 'pendiente_confirmacion':
      return { texto: 'Confirmar encargo', siguiente: 'confirmado' };
    case 'pago_aprobado':
    case 'confirmado':
      return { texto: 'Pasar a preparación', siguiente: 'en_preparacion' };
    case 'en_preparacion':
      return p.entrega === 'envio'
        ? { texto: 'Salió en camino', siguiente: 'en_camino' }
        : { texto: 'Listo para retirar', siguiente: 'listo_retirar' };
    case 'en_camino':
    case 'listo_retirar':
      return { texto: 'Marcar entregado', siguiente: 'entregado' };
    default:
      return null;
  }
}
