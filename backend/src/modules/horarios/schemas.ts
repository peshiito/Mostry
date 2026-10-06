import { z } from 'zod';
import { aMinutos } from '../../shared/utils/horaArgentina.js';

const hora = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Formato HH:MM (de 00:00 a 23:59)');
// El cierre además puede ser 24:00 ("hasta la medianoche").
const horaCierre = z.union([hora, z.literal('24:00')]);
const MAX_TRAMOS_POR_DIA = 4;

// Un tramo no cruza la medianoche: 20:00–02:00 se carga como 20:00–24:00 y 00:00–02:00.
const tramo = z
  .strictObject({ diaSemana: z.int().min(0).max(6), abre: hora, cierra: horaCierre })
  .refine(
    (t) => aMinutos(t.abre) < aMinutos(t.cierra),
    'La hora de cierre tiene que ser posterior a la de apertura',
  );

// Valida la semana entera: sin tramos superpuestos y como mucho 4 por día.
export const esquemaHorarios = z
  .strictObject({ tramos: z.array(tramo).max(7 * MAX_TRAMOS_POR_DIA) })
  .superRefine(({ tramos }, ctx) => {
    for (let dia = 0; dia <= 6; dia++) {
      const delDia = tramos
        .filter((t) => t.diaSemana === dia)
        .sort((a, b) => aMinutos(a.abre) - aMinutos(b.abre));
      if (delDia.length > MAX_TRAMOS_POR_DIA) {
        ctx.addIssue({
          code: 'custom',
          message: `Máximo ${MAX_TRAMOS_POR_DIA} tramos por día`,
          path: ['tramos'],
        });
      }
      for (let i = 1; i < delDia.length; i++) {
        if (aMinutos(delDia[i]!.abre) < aMinutos(delDia[i - 1]!.cierra)) {
          ctx.addIssue({
            code: 'custom',
            message: 'Hay tramos superpuestos el mismo día',
            path: ['tramos'],
          });
        }
      }
    }
  });

export const esquemaFeriado = z.strictObject({
  fecha: z.iso.date(),
  motivo: z.string().trim().max(100).optional(),
});

export const esquemaId = z.coerce.number().int().positive();
