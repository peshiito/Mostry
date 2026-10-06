import { z } from 'zod';

// Fechas con zona horaria explícita ('2026-10-12T00:00:00-03:00' o con Z).
const instante = z.iso.datetime({ offset: true }).transform((v) => new Date(v));
const campos = {
  titulo: z.string().trim().min(2).max(80),
  descripcion: z
    .string()
    .trim()
    .max(300)
    .nullable()
    .transform((v) => v || null)
    .optional(),
  desde: instante,
  hasta: instante,
  activa: z.boolean().optional(),
};
const rangoValido = (d: { desde?: Date; hasta?: Date }) =>
  !d.desde || !d.hasta || d.desde < d.hasta;
const MENSAJE_RANGO = {
  message: '"hasta" tiene que ser posterior a "desde"',
  path: ['hasta'],
};

export const esquemaNuevaPromocion = z
  .strictObject(campos)
  .refine(rangoValido, MENSAJE_RANGO);
export const esquemaEditarPromocion = z
  .strictObject(campos)
  .partial()
  .refine((d) => Object.keys(d).length > 0, 'No mandaste ningún cambio')
  .refine(rangoValido, MENSAJE_RANGO);

export const esquemaId = z.coerce.number().int().positive();
