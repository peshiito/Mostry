import { z } from 'zod';
import { normalizarWhatsapp } from '../../shared/utils/whatsapp.js';
import { PALETAS } from './paletas.js';

// Texto opcional: "" o null lo borran.
const textoOpcional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullable()
    .transform((v) => v || null)
    .optional();
const entero = (min: number, max: number) => z.int().min(min).max(max).optional();

const whatsapp = z
  .string()
  .max(30)
  .transform((valor, ctx) => {
    const normalizado = normalizarWhatsapp(valor);
    if (normalizado) return normalizado;
    ctx.addIssue({ code: 'custom', message: 'Escribilo con código de área, sin el 15' });
    return z.NEVER;
  });

// strictObject: estado, plan, slug, etc. NO se pueden tocar desde acá (mass assignment).
export const esquemaConfig = z
  .strictObject({
    nombre: z.string().trim().min(2).max(80).optional(),
    frase: textoOpcional(160),
    paleta: z.enum(PALETAS).optional(),
    whatsapp: whatsapp.nullable().optional(),
    direccion: textoOpcional(200),
    zonaEnvio: textoOpcional(120),
    plazoComprobanteHoras: entero(1, 72),
    plazoSenaHoras: entero(1, 168),
    anticipacionEncargoHoras: entero(0, 720),
    senaPorcentaje: entero(0, 100),
    costoEnvio: entero(0, 100_000_000),
    aceptaEnvio: z.boolean().optional(),
    aceptaRetiro: z.boolean().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, 'No mandaste ningún cambio');

export const esquemaCobro = z.strictObject({
  alias: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9.-]{6,20}$/,
      'De 6 a 20 caracteres: letras, números, puntos o guiones',
    ),
  titularAlias: z.string().trim().min(2).max(100),
  // Contraseña actual del que hace el cambio (acción sensible).
  clave: z.string().min(1).max(128),
});

export const esquemaPausa = z.strictObject({ pausada: z.boolean() });

export type DatosConfig = z.infer<typeof esquemaConfig>;
export type DatosCobro = z.infer<typeof esquemaCobro>;
