import { z } from 'zod';
import { normalizarWhatsapp } from '../../../shared/utils/whatsapp.js';
import { esSlugValido } from '../../../shared/utils/zonaDesdeOrigen.js';

// Mismas reglas que el registro (email, link) y que la config (WhatsApp).
const email = z.string().trim().toLowerCase().max(254).pipe(z.email('Email inválido'));
const slug = z
  .string()
  .trim()
  .toLowerCase()
  .refine(esSlugValido, 'Link inválido o reservado');
const whatsapp = z
  .string()
  .max(30)
  .transform((valor, ctx) => {
    const n = normalizarWhatsapp(valor);
    if (n) return n;
    ctx.addIssue({ code: 'custom', message: 'Escribilo con código de área, sin el 15' });
    return z.NEVER;
  });
const algo = (d: object) => Object.keys(d).length > 0;

export const esquemaDueno = z
  .strictObject({
    email: email.optional(),
    nombre: z.string().trim().min(2).max(100).optional(),
  })
  .refine(algo, 'No mandaste ningún cambio');

export const esquemaDatosTienda = z
  .strictObject({
    nombre: z.string().trim().min(2).max(80).optional(),
    slug: slug.optional(),
    whatsapp: whatsapp.nullable().optional(),
  })
  .refine(algo, 'No mandaste ningún cambio');

export const esquemaEliminar = z.strictObject({
  slugConfirmado: z.string().trim().toLowerCase().max(40),
  claveAdmin: z.string().min(1).max(128),
});

export type DatosDueno = z.infer<typeof esquemaDueno>;
export type DatosTiendaAdmin = z.infer<typeof esquemaDatosTienda>;
export type DatosEliminar = z.infer<typeof esquemaEliminar>;
