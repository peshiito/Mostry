import { DIRECCION, PAGADO, type Escena } from './datosPedidos.js';

// Entregados y uno cancelado (los encargos están en datosEncargos.ts).
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
];
