import { z } from 'zod';
import { plataPositiva } from '../../shared/utils/esquemas.js';

export { esquemaId } from '../../shared/utils/esquemas.js';

const MARGEN_FUTURO_MS = 24 * 60 * 60 * 1000; // por diferencias de reloj o zona

// Datos que carga el comerciante al aprobar (quedan guardados, sección 6.1).
export const esquemaAprobacion = z.strictObject({
  monto: plataPositiva,
  fechaOperacion: z.iso
    .datetime({ offset: true })
    .transform((v) => new Date(v))
    .refine(
      (f) => f.getTime() <= Date.now() + MARGEN_FUTURO_MS,
      'La fecha de la operación no puede ser futura',
    ),
  titular: z.string().trim().min(2).max(100),
  numeroOperacion: z.string().trim().min(1).max(60),
});

export const esquemaRechazo = z.strictObject({
  motivo: z.string().trim().min(3).max(200),
});

export type DatosAprobacion = z.infer<typeof esquemaAprobacion>;
