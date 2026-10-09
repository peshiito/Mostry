// Capturas reales de Mostry (public/landing/pasos y /panel).
// El recorrido de un pedido, en orden (por eso va numerado).
export const PASOS = [
  [
    '1-elegir',
    'Tu cliente elige',
    'Entra a tu link, arma el pedido y elige envío o retiro.',
  ],
  [
    '2-pagar',
    'Te transfiere a vos',
    'Ve tu alias y el monto exacto, y sube el comprobante.',
  ],
  ['3-aprobar', 'Revisás y aprobás', 'Cargás los datos del pago y entra solo a la caja.'],
  [
    '4-avisar',
    'Avisás por WhatsApp',
    'Un toque y le llega el mensaje con el link de seguimiento.',
  ],
];

// Lo que el comerciante tiene en el panel.
export const PANEL = [
  ['caja', 'Caja del día', 'Apertura, ingresos, egresos y la diferencia al cerrar.'],
  ['fiados', 'Libreta de fiados', 'Quién te debe y cuánto, con cada movimiento.'],
  ['encargos', 'Encargos', 'Calendario con hora, seña cobrada y lo que resta.'],
  ['stock', 'Stock bajo', 'Te avisa qué reponer antes de que se agote.'],
];
