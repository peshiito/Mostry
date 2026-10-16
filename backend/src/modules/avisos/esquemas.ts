import { z } from 'zod';
import { endpointPermitido } from './endpointPermitido.js';

const base64url = (min: number, max: number) =>
  z
    .string()
    .regex(/^[A-Za-z0-9_-]+={0,2}$/)
    .min(min)
    .max(max);
const endpoint = z
  .string()
  .max(500)
  .refine(endpointPermitido, 'Ese servicio de avisos no está permitido');

// Lo que arma el navegador con pushManager.subscribe() (toJSON()).
export const esquemaSuscripcion = z.strictObject({
  endpoint,
  keys: z.strictObject({ p256dh: base64url(80, 120), auth: base64url(16, 40) }),
  dispositivo: z.string().trim().max(60).optional(),
});

export const esquemaBaja = z.strictObject({ endpoint: z.string().max(500) });

const hora = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Hora inválida');
// Horario de silencio: los dos o ninguno (puede cruzar la medianoche: 23 a 7).
export const esquemaSilencio = z
  .strictObject({ desde: hora.nullable(), hasta: hora.nullable() })
  .refine((s) => (s.desde === null) === (s.hasta === null), 'Elegí desde y hasta')
  .refine(
    (s) => s.desde === null || s.desde !== s.hasta,
    'Desde y hasta no pueden ser iguales',
  );

export type DatosSuscripcion = z.infer<typeof esquemaSuscripcion>;
