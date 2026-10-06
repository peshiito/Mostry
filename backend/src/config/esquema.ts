import { z } from 'zod';

const texto = z.string().min(1);
const puerto = z.coerce.number().int().positive();

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
    URL_TIENDA: z.string().includes('{slug}'),
    TRUST_PROXY: z.coerce.number().int().min(0).default(0),
    DB_HOST: texto,
    DB_PUERTO: puerto,
    DB_NOMBRE: texto,
    DB_NOMBRE_TEST: texto.optional(),
    DB_USUARIO: texto,
    DB_CLAVE: texto,
    SECRETO_HMAC: z.string().min(32),
    SMTP_HOST: texto,
    SMTP_PUERTO: puerto,
    SMTP_USUARIO: z.string().optional(),
    SMTP_CLAVE: z.string().optional(),
    EMAIL_REMITENTE: texto,
    SEED_CLAVE: z.string().optional(),
    S3_ENDPOINT: z.url(),
    S3_REGION: texto,
    S3_ACCESS_KEY: texto,
    S3_SECRET_KEY: texto,
    S3_BUCKET_PUBLICO: texto,
    S3_BUCKET_PRIVADO: texto,
    S3_URL_PUBLICA: z.url(),
    S3_BUCKET_BACKUPS: texto,
    BACKUP_DUMP_CMD: texto.default('mysqldump -h {host} -P {puerto}'),
    BACKUP_MYSQL_CMD: texto.default('mysql -h {host} -P {puerto}'),
    MOSTRY_ALIAS: texto,
    MOSTRY_TITULAR: texto,
    PRECIO_MENSUAL: z.coerce.number().int().positive(),
  })
  .refine((c) => c.NODE_ENV !== 'production' || c.ORIGEN_PROTOCOLO === 'https', {
    message: 'En producción ORIGEN_PROTOCOLO tiene que ser https',
  })
  .refine((c) => c.NODE_ENV !== 'production' || c.TRUST_PROXY > 0, {
    message:
      'En producción TRUST_PROXY tiene que ser > 0 (si no, el rate limit por IP no sirve)',
  })
  .refine((c) => c.NODE_ENV !== 'test' || c.DB_NOMBRE_TEST, {
    message: 'Para correr tests falta DB_NOMBRE_TEST',
  });
