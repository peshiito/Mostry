import { PAGADO, type Escena } from './datosPedidos.js';

// Encargos: uno con seña ya pagada, uno sin seña confirmado y una torta
// personalizada que espera que Rosa la acepte (Encargos 2).
export const ENCARGOS: Escena[] = [
  {
    lineas: [['Lemon pie', 1]],
    nombre: 'Valeria Luna',
    whatsapp: '11 1212-3434',
    encargoEnDias: [3, 11],
    pasos: ['aceptar', ...PAGADO],
  },
  {
    lineas: [['Rogel', 1]],
    nombre: 'Familia Suárez',
    whatsapp: '11 5656-7878',
    encargoEnDias: [5, 17],
    sinSena: true,
    pasos: ['aceptar'],
  },
  {
    lineas: [
      [
        'Torta de cumpleaños',
        1,
        'Feliz cumple Martina! Chocolate con dulce de leche, rosa y blanca',
      ],
    ],
    nombre: 'Lucía Fernández',
    whatsapp: '11 6767-8989',
    encargoEnDias: [4, 16],
    pasos: [],
  },
];
