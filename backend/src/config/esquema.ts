import { z } from 'zod';

const texto = z.string().min(1);
const puerto = z.coerce.number().int().positive();
const clave32Bytes = z
  .string()
  .refine(
    (v) => Buffer.from(v, 'base64').length === 32,
    'Tienen que ser 32 bytes en base64',
  );

// Variables de entorno que usa la API (ver .env.example).
export const esquemaEnv = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    LOG_NIVEL: z
      .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
      .default('info'),
    PUERTO: puerto.default(3000),
    DOMINIO_BASE: texto,
    ORIGEN_PROTOCOLO: z.enum(['http', 'https']).default('https'),
    TRUST_PROXY: z.coerce.number().int().min(0).default(0),
    DB_HOST: texto,
    DB_PUERTO: puerto,
    DB_NOMBRE: texto,
    DB_NOMBRE_TEST: texto.optional(),
    DB_USUARIO: texto,
    DB_CLAVE: texto,
    SECRETO_HMAC: z.string().min(32),
    TOTP_CLAVE_CIFRADO: clave32Bytes,
    SMTP_HOST: texto,
    SMTP_PUERTO: puerto,
    SMTP_USUARIO: z.string().optional(),
    SMTP_CLAVE: z.string().optional(),
    EMAIL_REMITENTE: texto,
    SEED_CLAVE: z.string().optional(),
    MOSTRY_ALIAS: texto,
    MOSTRY_TITULAR: texto,
    PRECIO_MENSUAL: z.coerce.number().int().positive(),
  })
  .refine((c) => c.NODE_ENV !== 'production' || c.ORIGEN_PROTOCOLO === 'https', {
    message: 'En producción ORIGEN_PROTOCOLO tiene que ser https',
  })
  .refine((c) => c.NODE_ENV !== 'test' || c.DB_NOMBRE_TEST, {
    message: 'Para correr tests falta DB_NOMBRE_TEST',
  });
