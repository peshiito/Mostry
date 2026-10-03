import { producto as p } from '../producto.js';
import type { DatosSeed } from '../tipos.js';

export const donaRosaCatalogo: DatosSeed['categorias'] = [
  {
    nombre: 'Facturas',
    productos: [
      p('Medialuna de manteca', 35000, 120, {
        descripcion: 'Hojaldrada, con almíbar.',
        stockMinimo: 24,
        destacado: true,
      }),
      p('Vigilante', 40000, 40, { descripcion: 'Con membrillo y crema pastelera.' }),
      // Stock por debajo del mínimo: dispara la alerta del panel.
      p('Bola de fraile', 45000, 3, {
        descripcion: 'Con dulce de leche.',
        stockMinimo: 10,
      }),
      p('Docena surtida', 420000, 15, { stockMinimo: 5, destacado: true }),
    ],
  },
  {
    nombre: 'Tortas',
    productos: [
      p('Rogel', 2800000, 0, {
        descripcion: 'Capas finas con dulce de leche y merengue italiano.',
        aceptaEncargo: true,
        destacado: true,
      }),
      p('Lemon pie', 2200000, 2, {
        descripcion: 'Para 8 porciones.',
        aceptaEncargo: true,
      }),
    ],
  },
  {
    nombre: 'Panadería',
    productos: [
      p('Pan francés (1 kg)', 250000, 30, { stockMinimo: 10 }),
      // Producto desactivado: no aparece en la tienda pública.
      p('Chipá (½ kg)', 480000, 8, {
        descripcion: 'Con queso de verdad.',
        activo: false,
      }),
    ],
  },
];
