import type { Pedido } from '../repositorios/pedidos.repository.js';

// Lista de campos PERMITIDOS: una columna nueva en pedidos no sale sola al panel.
export const camposPanel = (p: Pedido) => ({
  id: p.id,
  numero: p.numero,
  estado: p.estado,
  tipo: p.tipo,
  clienteNombre: p.clienteNombre,
  clienteWhatsapp: p.clienteWhatsapp,
  entrega: p.entrega,
  direccion: p.direccion,
  linkMaps: p.linkMaps,
  fechaEncargo: p.fechaEncargo,
  subtotal: p.subtotal,
  costoEnvio: p.costoEnvio,
  total: p.total,
  sena: p.sena,
  venceComprobanteEn: p.venceComprobanteEn,
  rechazos: p.rechazos,
  motivoCancelacion: p.motivoCancelacion,
  canceladoEn: p.canceladoEn,
  entregadoEn: p.entregadoEn,
  creadoEn: p.creadoEn,
});
