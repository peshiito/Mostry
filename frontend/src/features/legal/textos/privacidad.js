import { privacidadDerechos } from './privacidadDerechos.js';

// Política de privacidad (Ley 25.326). Cada sección: [título, párrafos].
export const privacidad = (r) => [
  [
    'Quién es el responsable',
    [
      `Mostry es un servicio de ${r.nombre} (CUIT ${r.cuit}), responsable de los datos de los comercios y de los clientes del Club. Contacto: ${r.email}.`,
      'Los datos de los compradores de cada tienda son de ese comercio: Mostry los guarda por cuenta del comercio, solo para que la tienda funcione.',
    ],
  ],
  [
    'Qué datos guardamos',
    [
      'Del comercio: email, nombre, contraseña cifrada, los datos de la tienda (nombre, link, WhatsApp, dirección, alias de cobro) y lo que carga en el panel (productos, ventas, caja, gastos, fiados).',
      'De quien compra en una tienda: nombre, WhatsApp y, si pide envío, la dirección. Además, el comprobante de pago y, en un encargo, la foto de referencia si la sube.',
      'De los clientes del Club: email, nombre, WhatsApp, contraseña cifrada, dirección si la carga, y sus sellos y premios en cada tienda.',
    ],
  ],
  [
    'Para qué los usamos',
    [
      'Solo para dar el servicio: mostrar la tienda, armar y seguir los pedidos, llevar la gestión del comercio, mandar los mails necesarios (códigos, avisos de la suscripción, resumen de la mañana) y los avisos al celular que el comercio active.',
      'No vendemos ni compartimos datos con nadie para publicidad. No hay publicidad en Mostry.',
    ],
  ],
  [
    'Quién puede ver qué',
    [
      'Cada comercio ve solo los datos de su tienda. Un cliente del Club le muestra a cada tienda solo su nombre y lo que compró ahí, nunca lo de otras tiendas.',
      'El panel de administración de Mostry ve de cada tienda: su suscripción (estado, fechas y pagos), nombre, link, WhatsApp, rubro, cantidad de productos, el nombre y email del dueño, y los reportes que el comercio nos manda. Nunca ve ventas, caja, gastos, fiados ni datos de compradores.',
      'Para ayudarte con tu cuenta podemos corregir tu email, tu nombre, el link o el WhatsApp de la tienda, o darte una clave temporal; cada ayuda queda registrada. Para tocar el catálogo, los horarios o la configuración usamos el modo soporte, que el comercio habilita por 1 hora y que deja registrado cada cambio.',
      'Dicho con honestidad: como dueños del servidor, técnicamente podemos entrar a la base de datos. Lo hacemos solo para mantenimiento o para resolver un problema.',
    ],
  ],
  [
    'Dónde se guardan',
    [
      'En servidores de proveedores de infraestructura: el hosting de la aplicación y su base de datos, Cloudflare (dominio, seguridad y archivos) Resend (envío de mails) y los servicios de notificaciones de Google, Apple, Mozilla y Microsoft, que entregan los avisos al celular del comercio (viajan cifrados). Algunos pueden estar fuera de Argentina; solo procesan los datos para darnos ese servicio.',
      'Las contraseñas se guardan cifradas. Los comprobantes y las fotos de referencia van a un espacio privado y solo se ven con enlaces que vencen a los 5 minutos.',
    ],
  ],
  ...privacidadDerechos(r),
];
