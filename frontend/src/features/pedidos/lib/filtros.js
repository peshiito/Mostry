// Filtros de la lista de pedidos del panel (estados de 6.1).
export const FILTROS = [
  {
    valor: 'por_aprobar',
    texto: 'Por aprobar',
    estados: ['comprobante_enviado', 'pendiente_confirmacion'],
  },
  { valor: 'pendiente_pago', texto: 'Pendientes de pago', estados: ['pendiente_pago'] },
  {
    valor: 'en_preparacion',
    texto: 'En preparación',
    estados: ['pago_aprobado', 'confirmado', 'en_preparacion'],
  },
  { valor: 'listos', texto: 'Listos', estados: ['listo_retirar', 'en_camino'] },
  { valor: 'entregados', texto: 'Entregados', estados: ['entregado'] },
  { valor: 'cancelados', texto: 'Cancelados', estados: ['cancelado'] },
];

export const filtrar = (pedidos, filtro) =>
  pedidos.filter((p) =>
    FILTROS.find((f) => f.valor === filtro).estados.includes(p.estado),
  );
