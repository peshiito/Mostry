import { z } from 'zod';

// Única fuente de configuración: process.env validado al arrancar.
const esquema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    LOG_NIVEL: z
      .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
      .default('info'),
    PUERTO: z.coerce.number().int().positive().default(3000),
    DOMINIO_BASE: z.string().min(1),
    ORIGEN_PROTOCOLO: z.enum(['http', 'https']).default('https'),
    DB_HOST: z.string().min(1),
    DB_PUERTO: z.coerce.number().int().positive(),
    DB_NOMBRE: z.string().min(1),
    DB_NOMBRE_TEST: z.string().min(1).optional(),
    DB_USUARIO: z.string().min(1),
    DB_CLAVE: z.string().min(1),
  })
  .refine((c) => c.NODE_ENV !== 'production' || c.ORIGEN_PROTOCOLO === 'https', {
    message: 'En producción ORIGEN_PROTOCOLO tiene que ser https',
  })
  .refine((c) => c.NODE_ENV !== 'test' || c.DB_NOMBRE_TEST, {
    message: 'Para correr tests falta DB_NOMBRE_TEST',
  });

const resultado = esquema.safeParse(process.env);

if (!resultado.success) {
  throw new Error(`Configuración inválida:\n${z.prettifyError(resultado.error)}`);
}

const datos = resultado.data;

export const config = {
  ...datos,
  // Los tests nunca tocan la base de desarrollo.
  nombreBase: datos.NODE_ENV === 'test' ? datos.DB_NOMBRE_TEST! : datos.DB_NOMBRE,
};

export type Config = typeof config;
