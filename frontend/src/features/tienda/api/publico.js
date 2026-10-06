import { api } from '../../../shared/api/cliente.js';

// Endpoints públicos de la tienda (/publico). La tienda la resuelve la API por el Origin.
export const publicoApi = {
  crearPedido: (d) => api('/publico/pedidos', { metodo: 'POST', cuerpo: d }),
  disponibilidad: (fecha) => api(`/publico/encargos/disponibilidad?fecha=${fecha}`),
  subirComprobante: (token, archivo) => {
    const datos = new FormData();
    datos.append('comprobante', archivo);
    return api(`/publico/pedidos/${token}/comprobante`, {
      metodo: 'POST',
      archivo: datos,
    });
  },
};
