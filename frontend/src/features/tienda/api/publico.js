import { api } from '../../../shared/api/cliente.js';

// Endpoints públicos de la tienda (/publico). La tienda la resuelve la API por el Origin.
export const publicoApi = {
  crearPedido: (d) => api('/publico/pedidos', { metodo: 'POST', cuerpo: d }),
  disponibilidad: (fecha) => api(`/publico/encargos/disponibilidad?fecha=${fecha}`),
  subirComprobante: (token, archivo, onProgreso) => {
    const datos = new FormData();
    datos.append('comprobante', archivo);
    return api(`/publico/pedidos/${token}/comprobante`, {
      metodo: 'POST',
      archivo: datos,
      onProgreso,
    });
  },
  // Encargos 2: foto de referencia de un ítem personalizado (privada).
  subirFotoItem: (token, itemId, archivo, onProgreso) => {
    const datos = new FormData();
    datos.append('foto', archivo);
    return api(`/publico/pedidos/${token}/items/${itemId}/foto`, {
      metodo: 'POST',
      archivo: datos,
      onProgreso,
    });
  },
  seguimiento: (token) => api(`/publico/pedidos/${token}`),
};
