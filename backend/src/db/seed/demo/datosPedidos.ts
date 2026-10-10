import type { Linea } from './pedidos.js';

// Cada pedido de la demo: qué compra, quién, cómo y por qué pasos pasa.
// Pasos: comprobante (el cliente lo sube), aprobar (la comerciante), un estado
// del panel, o cancelar. sinSena: encargo de una tienda que no pide seña.
export type Escena = {
  lineas: Linea[];
  nombre: string;
  whatsapp: string;
  envio?: string;
  encargoEnDias?: [dias: number, hora: number];
  sinSena?: boolean;
  pasos: string[];
};
export const DIRECCION = 'Av. San Martín 1234, depto 2B';
export const PAGADO = ['comprobante', 'aprobar'];

// Pedidos del día, cada uno en un estado distinto del circuito.
export const AL_DIA: Escena[] = [
  {
    lineas: [['Medialuna de manteca', 6]],
    nombre: 'Carla Benítez',
    whatsapp: '11 4567-1234',
    pasos: [],
  },
  {
    lineas: [['Docena surtida', 1]],
    nombre: 'Lucas Ferreyra',
    whatsapp: '11 5555-2020',
    pasos: ['comprobante'],
  },
  {
    lineas: [['Pan francés (1 kg)', 2]],
    nombre: 'Sofía Ramírez',
    whatsapp: '11 3030-4040',
    pasos: PAGADO,
  },
  {
    lineas: [['Docena surtida', 2]],
    nombre: 'Martín Ortiz',
    whatsapp: '11 6060-7070',
    envio: DIRECCION,
    pasos: [...PAGADO, 'en_preparacion'],
  },
  {
    lineas: [
      ['Vigilante', 6],
      ['Pan francés (1 kg)', 1],
    ],
    nombre: 'Julieta Díaz',
    whatsapp: '11 7070-8080',
    envio: DIRECCION,
    pasos: [...PAGADO, 'en_preparacion', 'en_camino'],
  },
  {
    lineas: [['Medialuna de manteca', 12]],
    nombre: 'Diego Sosa',
    whatsapp: '11 8080-9090',
    pasos: [...PAGADO, 'en_preparacion', 'listo_retirar'],
  },
];
