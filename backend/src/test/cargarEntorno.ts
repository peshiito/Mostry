// Carga ../.env si existe (en CI las variables vienen del entorno) y fuerza modo test.
import { existsSync } from 'node:fs';

const archivo = new URL('../../../.env', import.meta.url);
if (existsSync(archivo)) process.loadEnvFile(archivo);
process.env.NODE_ENV = 'test';
process.env.LOG_NIVEL = 'silent';
// Los orígenes de los tests usan localhost, sin importar el dominio de desarrollo.
process.env.DOMINIO_BASE = 'localhost';
process.env.ORIGEN_PROTOCOLO = 'http';

// Los tests usan su propio bucket público: nunca tocan las fotos de desarrollo.
const {
  S3_BUCKET_PUBLICO: real,
  S3_BUCKET_PUBLICO_TEST: deTest,
  S3_URL_PUBLICA: url,
} = process.env;
if (!deTest || !real || !url)
  throw new Error('Faltan S3_BUCKET_PUBLICO_TEST / S3_URL_PUBLICA en el entorno');
process.env.S3_BUCKET_PUBLICO = deTest;
process.env.S3_URL_PUBLICA = url.replace(new RegExp(`/${real}$`), `/${deTest}`);
if (!process.env.S3_BUCKET_PRIVADO_TEST)
  throw new Error('Falta S3_BUCKET_PRIVADO_TEST en el entorno');
process.env.S3_BUCKET_PRIVADO = process.env.S3_BUCKET_PRIVADO_TEST;
// Los backups de los tests van al bucket privado de test (que se vacía en cada test).
process.env.S3_BUCKET_BACKUPS = process.env.S3_BUCKET_PRIVADO_TEST;
