// Términos y condiciones para los comercios. Cada sección: [título, párrafos].
export const terminos = (r) => [
  [
    'Qué es Mostry',
    [
      `Mostry es un servicio de ${r.nombre} (CUIT ${r.cuit}) que le da a cada comercio una tienda online propia y herramientas de gestión: pedidos, stock, caja, encargos, gastos, libreta de fiados y un club de clientes.`,
      'El comercio es el vendedor. Mostry no compra, no vende, no entrega productos y no participa de las ventas.',
    ],
  ],
  [
    'Prueba gratis y suscripción',
    [
      'Al registrarte tenés 7 días gratis con todas las funciones, sin tarjeta. Después, el plan cuesta $ 10.000 por mes y se paga por transferencia al alias de Mostry.',
      'Si el plan vence, la tienda sigue funcionando 3 días de gracia. Después se suspende: la tienda muestra "Cerrada temporalmente" y el panel queda en solo lectura. Suspender no borra nada: al pagar vuelve todo como estaba. Una tienda suspendida solo se elimina si lo pedís o si queda suspendida mucho tiempo sin uso; en ese caso te avisamos antes por mail.',
      'El precio puede cambiar. Si cambia, te avisamos con al menos 30 días de anticipación y el cambio vale desde el período siguiente.',
    ],
  ],
  [
    'Cobros a tus clientes',
    [
      'Tus clientes te pagan directo a tu alias o en tu local. Mostry no recibe, no retiene y no cobra comisión sobre esa plata.',
      'Revisar los comprobantes, entregar los pedidos y resolver reclamos de tus clientes es responsabilidad del comercio.',
    ],
  ],
  [
    'Lo que publicás',
    [
      'Sos responsable de lo que vendés y publicás: productos, precios, fotos, textos y promociones. Tienen que ser legales, reales y tuyos (o tener permiso para usarlos).',
      'No se puede usar Mostry para vender productos prohibidos, engañar a compradores ni mandar spam. Si pasa, podemos suspender la tienda, con aviso cuando sea posible.',
    ],
  ],
  [
    'Club de clientes',
    [
      'El club de clientes viene incluido, sin costo extra. Cada comercio decide si lo usa, cuántas compras hacen falta y qué premio da, y es quien entrega ese premio.',
    ],
  ],
  [
    'Tu cuenta y la baja',
    [
      'Cuidá tu contraseña: lo que se haga con tu cuenta corre por tu cuenta. Si sospechás que alguien entró, cambiala y avisanos.',
      `Podés dejar de usar Mostry cuando quieras, sin permanencia. Si querés que borremos tu tienda y tus datos, escribinos a ${r.email}.`,
    ],
  ],
  [
    'Límites de responsabilidad',
    [
      'Hacemos lo posible para que Mostry funcione siempre y tus datos estén seguros, con copias de respaldo diarias. Aun así, puede haber cortes o errores. Si un problema nuestro no te deja usar Mostry, podemos compensarte con días de cortesía.',
      'Mostry no responde por las ventas, entregas o reclamos entre el comercio y sus clientes, ni por pérdidas indirectas. Nuestra responsabilidad máxima es lo que pagaste en los últimos 3 meses.',
    ],
  ],
  [
    'Cambios y ley aplicable',
    [
      'Si cambiamos estos términos, te lo vamos a pedir aceptar de nuevo al entrar al panel.',
      'Se rigen por las leyes de la República Argentina. Ante un desacuerdo, primero escribinos: casi todo se resuelve hablando.',
    ],
  ],
];
