import { dentroDeDias } from '../fechas.js';
import type { DatosSeed } from '../tipos.js';
import { donaRosaCatalogo } from './donaRosaCatalogo.js';

export const donaRosa: DatosSeed = {
  tienda: {
    slug: 'dona-rosa',
    nombre: 'Facturería Doña Rosa',
    frase: 'Facturas caseras desde 1987, recién salidas del horno.',
    alias: 'dona.rosa.facturas',
    titularAlias: 'Rosa Elena Gómez',
    whatsapp: '5491123456789',
    direccion: 'Av. Hipólito Yrigoyen 4250, Lanús Oeste',
    estado: 'activa',
    planHasta: dentroDeDias(30),
    costoEnvio: 150000,
    zonaEnvio: 'Lanús Oeste y Remedios de Escalada',
    senaPorcentaje: 30,
  },
  duenio: { email: 'rosa@dona-rosa.test', nombre: 'Rosa Gómez' },
  categorias: donaRosaCatalogo,
  horarios: [
    { dias: [1, 2, 3, 4, 5, 6], abre: '07:00', cierra: '13:00' },
    { dias: [1, 2, 3, 4, 5], abre: '16:30', cierra: '20:30' },
    { dias: [0], abre: '08:00', cierra: '13:00' },
  ],
  promocion: {
    titulo: '2x1 en medialunas',
    descripcion: 'Martes y jueves de 16 a 18 h.',
    dias: 14,
  },
  feriado: { fecha: '2026-12-25', motivo: 'Navidad' },
};
