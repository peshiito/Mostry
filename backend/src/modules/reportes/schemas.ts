import { z } from 'zod';
import { ESTADOS_REPORTE } from '../../shared/db/tipos/plataforma.js';

// Secciones del panel donde puede pasar un problema (las elige el comercio).
export const PANTALLAS = [
  'inicio',
  'pedidos',
  'productos',
  'caja',
  'encargos',
  'libreta',
  'gastos',
  'mi_tienda',
  'tienda_publica',
  'otra',
] as const;

export const esquemaReporte = z.strictObject({
  pantalla: z.enum(PANTALLAS),
  descripcion: z
    .string()
    .trim()
    .min(10, 'Contanos un poco más (10 letras mínimo)')
    .max(2000),
});

export const esquemaRespuesta = z.strictObject({
  estado: z.enum(ESTADOS_REPORTE),
  respuesta: z.string().trim().max(1000).nullable().optional(),
});

export const esquemaFiltro = z.strictObject({
  estado: z.enum(ESTADOS_REPORTE).optional(),
});

export const esquemaId = z.coerce.number().int().positive();
