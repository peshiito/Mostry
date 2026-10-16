import { api } from '../../../shared/api/cliente.js';

// Endpoints del admin (/admin). Usan la cookie de sesión del admin (aparte del panel).
export const adminApi = {
  registrarPago: (id, d) =>
    api(`/admin/tiendas/${id}/pagos`, { metodo: 'POST', cuerpo: d }),
  regalarDias: (id, d) =>
    api(`/admin/tiendas/${id}/cortesia`, { metodo: 'POST', cuerpo: d }),
  suspender: (id, motivo) =>
    api(`/admin/tiendas/${id}/suspender`, { metodo: 'POST', cuerpo: { motivo } }),
  reactivar: (id) => api(`/admin/tiendas/${id}/reactivar`, { metodo: 'POST' }),
  // Ayuda con la cuenta y eliminación (Mejoras 4).
  cambiarDueno: (id, d) =>
    api(`/admin/tiendas/${id}/dueno`, { metodo: 'PATCH', cuerpo: d }),
  corregirTienda: (id, d) =>
    api(`/admin/tiendas/${id}/datos`, { metodo: 'PATCH', cuerpo: d }),
  claveTemporal: (id) => api(`/admin/tiendas/${id}/clave-temporal`, { metodo: 'POST' }),
  reenviarMail: (id) => api(`/admin/tiendas/${id}/reenviar-mail`, { metodo: 'POST' }),
  eliminar: (id, d) => api(`/admin/tiendas/${id}`, { metodo: 'DELETE', cuerpo: d }),
};

// Tienda del listado o del detalle → formato de las pantallas.
export const adaptarTiendaAdmin = (t, extra = {}) => ({
  ...t,
  vence: t.planHasta ?? t.pruebaHasta,
  alta: t.creadoEn,
  duena: extra.duenos?.[0]?.nombre ?? '',
  email: t.emailDueno ?? extra.duenos?.[0]?.email ?? '',
  productos: extra.conteos?.productos,
  pagos: extra.pagos ?? [],
  // Del detalle: para el WhatsApp (saludo y vencimiento) y el modo soporte.
  ...(extra.duenos && {
    nombreDueno: extra.duenos[0]?.nombre ?? null,
    verificado: Boolean(extra.duenos[0]?.emailVerificadoEn),
  }),
  ...(extra.suscripcion && {
    venceEl: extra.suscripcion.venceEl,
    diasRestantes: extra.suscripcion.diasRestantes,
  }),
  soporte: extra.soporte ?? null,
});
