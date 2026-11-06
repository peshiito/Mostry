import { z } from 'zod';
import {
  ENCABEZADOS,
  FORMAS,
  FUENTES,
  FUENTES_TEXTO,
  PATRONES,
  PLANTILLAS,
} from './catalogoTema.js';

// Colores en #rrggbb (minúscula): el frontend calcula el contraste a partir de acá.
const color = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, 'Color inválido')
  .transform((c) => c.toLowerCase());

// strictObject en todos los niveles: nada que no esperemos entra al JSON.
export const esquemaTema = z.strictObject({
  base: z.string().regex(/^[a-z]{2,20}$/),
  colores: z.strictObject({ principal: color, acento: color, fondo: color }),
  fuentes: z.strictObject({
    titulos: z.enum(FUENTES),
    texto: z.enum(FUENTES_TEXTO),
  }),
  forma: z.enum(FORMAS),
  encabezado: z.enum(ENCABEZADOS),
  fondo: z.strictObject({
    tipo: z.enum(['liso', 'patron']),
    patron: z.enum(PATRONES),
    intensidad: z.int().min(0).max(100),
  }),
  plantilla: z.enum(PLANTILLAS),
});

export type TemaTienda = z.infer<typeof esquemaTema>;
