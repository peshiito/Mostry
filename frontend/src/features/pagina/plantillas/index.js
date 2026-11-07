import { TEMAS } from '../../../shared/temaTienda/temas.js';
import { ALMACEN } from './almacen.js';
import { COMIDA } from './comida.js';
import { MODA } from './moda.js';
import * as p from './piezas.js';

const BLOQUES = { ...MODA, ...COMIDA, ...ALMACEN };

// Una página armada por cada estilo de Diseño de tu tienda (mismo orden y
// nombre), más "Empezar de cero".
export const PLANTILLAS = [
  ...TEMAS.map((t) => ({
    clave: t.clave,
    nombre: t.nombre,
    para: t.para,
    colores: t.tema.colores,
    bloques: BLOQUES[t.clave],
  })),
  {
    clave: 'cero',
    nombre: 'Empezar de cero',
    para: 'Una portada, tus productos y el contacto',
    colores: null,
    bloques: [p.portada(), p.todo(null), p.cierre()],
  },
];

export const plantilla = (clave) => PLANTILLAS.find((x) => x.clave === clave) ?? null;
