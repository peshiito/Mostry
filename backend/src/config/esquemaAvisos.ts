import { z } from 'zod';

// Avisos push al teléfono (Avisos 1). Sin claves VAPID no se manda nada; en
// producción son obligatorias. Generalas con `npm run avisos:claves`.
export const camposAvisos = {
  VAPID_PUBLICA: z.string().min(80).optional(),
  VAPID_PRIVADA: z.string().min(40).optional(),
  VAPID_CONTACTO: z
    .string()
    .regex(/^(mailto:|https:)/)
    .optional(),
  // Solo tests: hosts de push extra permitidos (separados por coma).
  AVISOS_HOSTS_EXTRA: z.string().optional(),
};

type ConAvisos = { NODE_ENV: string } & {
  [K in keyof typeof camposAvisos]?: string;
};

export const avisosEnProduccion = (c: ConAvisos) =>
  c.NODE_ENV !== 'production' ||
  Boolean(
    c.VAPID_PUBLICA && c.VAPID_PRIVADA && c.VAPID_CONTACTO && !c.AVISOS_HOSTS_EXTRA,
  );
