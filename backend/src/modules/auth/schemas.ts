import { z } from 'zod';
import { esSlugValido } from '../../shared/utils/zonaDesdeOrigen.js';

// strictObject: rechaza campos que no esperamos (sin mass assignment).
const email = z.string().trim().toLowerCase().max(254).pipe(z.email('Email inválido'));
const clave = z.string().min(10, 'Mínimo 10 caracteres').max(128);
const codigo = z.string().regex(/^\d{6}$/, 'Son 6 dígitos');
const codigoRecuperacion = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z2-7]{5}-[a-z2-7]{5}$/, 'Formato: xxxxx-xxxxx');
const segundoFactor = {
  codigoTotp: codigo.optional(),
  codigoRecuperacion: codigoRecuperacion.optional(),
};
const unoSolo = (d: { codigoTotp?: string; codigoRecuperacion?: string }) =>
  Boolean(d.codigoTotp) !== Boolean(d.codigoRecuperacion);

export const esquemaRegistro = z.strictObject({
  email,
  clave,
  nombre: z.string().trim().min(2).max(100),
  nombreNegocio: z.string().trim().min(2).max(80),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .refine(esSlugValido, 'Subdominio inválido o reservado'),
});

export const esquemaEmail = z.strictObject({ email });
export const esquemaVerificar = z.strictObject({ email, codigo });
export const esquemaLogin = z.strictObject({ email, clave: z.string().min(1).max(128) });
export const esquemaActivarTotp = z.strictObject({ codigoTotp: codigo });
export const esquemaSegundoFactor = z
  .strictObject(segundoFactor)
  .refine(unoSolo, 'Mandá el código de la app o uno de recuperación');

export const esquemaRecuperar = z
  .strictObject({ email, codigo, claveNueva: clave, ...segundoFactor })
  .refine((d) => !d.codigoTotp || !d.codigoRecuperacion, 'Mandá un solo segundo factor');

export const esquemaCambiarClave = z.strictObject({
  claveActual: z.string().min(1).max(128),
  claveNueva: clave,
  codigoTotp: codigo,
});

export type DatosRegistro = z.infer<typeof esquemaRegistro>;
export type DatosRecuperar = z.infer<typeof esquemaRecuperar>;
export type DatosCambiarClave = z.infer<typeof esquemaCambiarClave>;
