import { dentroDeDias } from '../fechas.js';
import type { DatosSeed } from '../tipos.js';
import { heladeriaCatalogo } from './heladeriaCatalogo.js';

export const heladeria: DatosSeed = {
  tienda: {
    slug: 'heladeria',
    nombre: 'Heladería del Parque',
    frase: 'Helado artesanal, hecho todos los días.',
    alias: 'heladeria.parque',
    titularAlias: 'Martín Ruiz',
    whatsapp: '5491198765432',
    direccion: 'Calle 9 de Julio 1100, Lanús Este',
    estado: 'prueba',
    pruebaHasta: dentroDeDias(6),
    costoEnvio: 0,
    zonaEnvio: 'Hasta 15 cuadras',
    plazoComprobanteHoras: 1,
  },
  duenio: { email: 'martin@heladeria.test', nombre: 'Martín Ruiz' },
  categorias: heladeriaCatalogo,
  horarios: [{ dias: [0, 2, 3, 4, 5, 6], abre: '13:00', cierra: '23:59' }],
  promocion: {
    titulo: 'Cucurucho gratis',
    descripcion: 'Con cada kilo, los domingos.',
    dias: 30,
  },
  feriado: { fecha: '2027-01-01', motivo: 'Año nuevo' },
};
