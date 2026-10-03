import { producto as p } from '../producto.js';
import type { DatosSeed } from '../tipos.js';

export const heladeriaCatalogo: DatosSeed['categorias'] = [
  {
    nombre: 'Potes',
    productos: [
      p('¼ kg', 650000, 50, { descripcion: 'Hasta 2 gustos.', destacado: true }),
      p('½ kg', 1200000, 40, { descripcion: 'Hasta 3 gustos.' }),
      p('1 kg', 2200000, 25, { descripcion: 'Hasta 4 gustos.', destacado: true }),
    ],
  },
  {
    nombre: 'Postres helados',
    productos: [
      p('Almendrado', 1800000, 4, {
        descripcion: 'Para 6 personas.',
        aceptaEncargo: true,
      }),
      p('Torta helada', 3500000, 0, {
        descripcion: 'Por encargo, con 48 h de anticipación.',
        aceptaEncargo: true,
      }),
    ],
  },
];
