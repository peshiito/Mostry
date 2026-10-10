import { describe, expect, it } from 'vitest';
import { esquemaEnv } from './esquema.js';

// Lo mínimo para que la config sea válida en producción.
const PRODUCCION = {
  NODE_ENV: 'production',
  ORIGEN_PROTOCOLO: 'https',
  TRUST_PROXY: '2',
  BACKUP_ENTORNO: 'produccion',
  DOMINIO_BASE: 'mostry.com.ar',
  URL_TIENDA: 'https://{slug}.mostry.com.ar',
  DB_HOST: 'mysql',
  DB_PUERTO: '3306',
  DB_NOMBRE: 'mostry',
  DB_USUARIO: 'mostry',
  DB_CLAVE: 'una-clave',
  SECRETO_HMAC: 'x'.repeat(48),
  SMTP_HOST: 'smtp.resend.com',
  SMTP_PUERTO: '465',
  EMAIL_REMITENTE: 'Mostry <hola@mostry.com.ar>',
  S3_ENDPOINT: 'https://cuenta.r2.cloudflarestorage.com',
  S3_REGION: 'auto',
  S3_ACCESS_KEY: 'clave',
  S3_SECRET_KEY: 'secreto',
  S3_BUCKET_PUBLICO: 'mostry-publico',
  S3_BUCKET_PRIVADO: 'mostry-privado',
  S3_URL_PUBLICA: 'https://archivos.mostry.com.ar',
  S3_BUCKET_BACKUPS: 'mostry-backups',
  MOSTRY_ALIAS: 'mostry.pagos',
  MOSTRY_TITULAR: 'Pedro Báez',
  PRECIO_MENSUAL: '1000000',
};
const errores = (cambios: object) => {
  const r = esquemaEnv.safeParse({ ...PRODUCCION, ...cambios });
  return r.success ? [] : r.error.issues.map((i) => i.message);
};

describe('config de producción', () => {
  it('la config completa de producción es válida', () => {
    expect(errores({})).toEqual([]);
  });

  it('exige https, proxy de confianza y carpeta propia para los backups', () => {
    expect(errores({ ORIGEN_PROTOCOLO: 'http' })).toEqual([
      expect.stringMatching(/https/),
    ]);
    expect(errores({ TRUST_PROXY: '0' })).toEqual([expect.stringMatching(/TRUST_PROXY/)]);
    expect(errores({ BACKUP_ENTORNO: undefined })).toEqual([
      expect.stringMatching(/BACKUP_ENTORNO/),
    ]);
    expect(errores({ BACKUP_ENTORNO: 'Producción!' }).length).toBeGreaterThan(0);
  });
});
