import { api } from '../../../shared/api/cliente.js';

// Endpoints del admin (/admin). Usan la cookie de sesión del admin (aparte del panel).
export const adminApi = {
  registrarPago: (id, d) =>
    api(`/admin/tiendas/${id}/pagos`, { metodo: 'POST', cuerpo: d }),
  suspender: (id, motivo) =>
    api(`/admin/tiendas/${id}/suspender`, { metodo: 'POST', cuerpo: { motivo } }),
  reactivar: (id) => api(`/admin/tiendas/${id}/reactivar`, { metodo: 'POST' }),
};

// Tienda del listado o del detalle → formato de las pantallas.
export const adaptarTiendaAdmin = (t, extra = {}) => ({
  ...t,
  vence: t.planHasta ?? t.pruebaHasta,
  alta: t.creadoEn,
  duena: extra.duenos?.[0]?.nombre ?? '',
  email: t.emailDueno ?? extra.duenos?.[0]?.email ?? '',
  productos: extra.conteos?.productos,
  pedidos: extra.conteos?.pedidos,
  pagos: extra.pagos ?? [],
});
