import { z } from 'zod';

const ESTADOS = ['prueba', 'activa', 'gracia', 'suspendida'] as const;

// Fecha de hoy en Argentina ('YYYY-MM-DD'): no se registran pagos del futuro.
const hoyEnArgentina = () =>
  new Date().toLocaleDateString('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' });

export const esquemaId = z.coerce.number().int().positive();

export const esquemaListado = z.strictObject({
  buscar: z.string().trim().max(100).optional(),
  estado: z.enum(ESTADOS).optional(),
  pagina: z.coerce.number().int().min(1).max(1000).default(1),
});

export const esquemaPago = z.strictObject({
  monto: z.int().min(1).max(100_000_000),
  pagadoEn: z.iso
    .date()
    .refine((f) => f <= hoyEnArgentina(), 'La fecha no puede ser futura'),
  nota: z.string().trim().max(200).optional(),
});

export const esquemaSuspender = z.strictObject({
  motivo: z.string().trim().min(3).max(200),
});

export type FiltrosListado = z.infer<typeof esquemaListado>;
export type DatosPago = z.infer<typeof esquemaPago>;
