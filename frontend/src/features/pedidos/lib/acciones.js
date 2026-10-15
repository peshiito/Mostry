// Próximo paso del pedido según su estado (botón coral del detalle).
export function accionPrincipal(p) {
  switch (p.estado) {
    case 'comprobante_enviado':
      return { texto: 'Revisar comprobante', ruta: `/panel/pedidos/${p.id}/comprobante` };
    case 'pendiente_confirmacion':
      // Encargos 2: todo encargo se acepta (con seña, recién ahí se pide el pago).
      // Un pedido inmediato llega acá solo si un premio del Club lo dejó gratis.
      return p.tipo === 'encargo'
        ? { texto: 'Aceptar encargo', siguiente: 'aceptar' }
        : { texto: 'Confirmar pedido', siguiente: 'confirmado' };
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

// Encargo que espera que la tienda lo acepte (rechazarlo = cancelarlo con motivo).
export const porAceptar = (p) =>
  p.tipo === 'encargo' && p.estado === 'pendiente_confirmacion';
