import { DIRECCION, PAGADO, type Escena } from './datosPedidos.js';

// Entregados, uno cancelado y los dos encargos (con seña y sin seña).
export const ESPECIALES: Escena[] = [
  {
    lineas: [['Bola de fraile', 2]],
    nombre: 'Paula Gómez',
    whatsapp: '11 9090-1010',
    pasos: [...PAGADO, 'en_preparacion', 'listo_retirar', 'entregado'],
  },
  {
    lineas: [['Pan francés (1 kg)', 1]],
    nombre: 'Tomás Acosta',
    whatsapp: '11 2121-3131',
    envio: DIRECCION,
    pasos: [...PAGADO, 'en_preparacion', 'en_camino', 'entregado'],
  },
  {
    lineas: [['Medialuna de manteca', 24]],
    nombre: 'Ramiro Paz',
    whatsapp: '11 4141-5151',
    pasos: ['cancelar'],
  },
  {
    lineas: [['Lemon pie', 1]],
    nombre: 'Valeria Luna',
    whatsapp: '11 1212-3434',
    encargoEnDias: [3, 11],
    pasos: PAGADO,
  },
  {
    lineas: [['Rogel', 1]],
    nombre: 'Familia Suárez',
    whatsapp: '11 5656-7878',
    encargoEnDias: [5, 17],
    sinSena: true,
    pasos: ['confirmado'],
  },
];
