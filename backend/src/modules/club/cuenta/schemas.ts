import { z } from 'zod';
import { normalizarWhatsapp } from '../../../shared/utils/whatsapp.js';

// strictObject: rechaza campos que no esperamos (sin mass assignment).
const email = z.string().trim().toLowerCase().max(254).pipe(z.email('Email inválido'));
const clave = z.string().min(10, 'Mínimo 10 caracteres').max(128);
const codigo = z.string().regex(/^\d{6}$/, 'Son 6 dígitos');
const nombre = z.string().trim().min(2).max(100);
const direccion = z.string().trim().max(200).nullable();
const whatsapp = z
  .string()
  .max(30)
  .transform((v, ctx) => {
    const n = normalizarWhatsapp(v);
    if (!n)
      ctx.addIssue({
        code: 'custom',
        message: 'Escribí tu WhatsApp con código de área, sin el 15',
      });
    return n ?? z.NEVER;
  });

export const esquemaRegistroClub = z.strictObject({
  email,
  clave,
  nombre,
  whatsapp,
  direccion: direccion.optional(),
  // Ley 25.326: sin aceptar términos y política de privacidad no hay cuenta.
  aceptoTerminos: z.literal(true, 'Tenés que aceptar los términos'),
});

export const esquemaDatosClub = z
  .strictObject({ nombre, whatsapp, direccion })
  .partial()
  .refine((d) => Object.keys(d).length > 0, 'No hay nada para cambiar');

export const esquemaEmailClub = z.strictObject({ email });
// Verificar pide también la clave del registro: así, quien verifica el email es
// quien eligió la clave (nadie puede registrar un email ajeno y quedarse la cuenta).
export const esquemaVerificarClub = z.strictObject({
  email,
  codigo,
  clave: z.string().min(1).max(128),
});
export const esquemaLoginClub = z.strictObject({
  email,
  clave: z.string().min(1).max(128),
});
export const esquemaRecuperarClub = z.strictObject({ email, codigo, claveNueva: clave });
export const esquemaBorrarClub = z.strictObject({ clave: z.string().min(1).max(128) });

export type DatosRegistroClub = z.infer<typeof esquemaRegistroClub>;
export type DatosClub = z.infer<typeof esquemaDatosClub>;
export type DatosRecuperarClub = z.infer<typeof esquemaRecuperarClub>;
