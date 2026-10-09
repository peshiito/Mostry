import { readFileSync } from 'node:fs';

// Lee el .env de la raíz (sin dependencias). Solo se usa para armar el entorno de prueba.
const env = Object.fromEntries(
  readFileSync(new URL('../../.env', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => /^[A-Z0-9_]+=/.test(l))
    .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]),
);

// Puertos propios: los tests NO usan la base ni los servidores de desarrollo.
export const PUERTO_API = 3100;
export const PUERTO_WEB = 5273;
export const PUERTO_PWA = 5274; // el build (vite preview): ahí vive el service worker
export const BASE_E2E = 'mostry_e2e';
export const CLAVE = env.SEED_CLAVE;
export const urlTienda = (slug, ruta = '') =>
  `http://${slug}.mostry.localhost:${PUERTO_WEB}${ruta}`;
export const URL_SITIO = `http://mostry.localhost:${PUERTO_WEB}`;
export const URL_ADMIN = `http://admin.mostry.localhost:${PUERTO_WEB}`;
export const URL_MAILPIT = 'http://localhost:8025';

// Variables para la API de prueba: base e2e, buckets de test y mails a Mailpit.
export const ENV_API = {
  DB_NOMBRE: BASE_E2E,
  PUERTO: String(PUERTO_API),
  URL_TIENDA: `http://{slug}.mostry.localhost:${PUERTO_WEB}`,
  S3_BUCKET_PUBLICO: env.S3_BUCKET_PUBLICO_TEST,
  S3_BUCKET_PRIVADO: env.S3_BUCKET_PRIVADO_TEST,
  S3_URL_PUBLICA: env.S3_URL_PUBLICA.replace(
    env.S3_BUCKET_PUBLICO,
    env.S3_BUCKET_PUBLICO_TEST,
  ),
  SMTP_HOST: 'localhost',
  SMTP_PUERTO: '1025',
  SMTP_USUARIO: '',
  SMTP_CLAVE: '',
  EMAIL_REMITENTE: 'Mostry <no-responder@mostry.test>',
};

export const BASE_DATOS = {
  host: '127.0.0.1',
  port: Number(env.DB_PUERTO),
  user: env.DB_USUARIO,
  password: env.DB_CLAVE,
  database: BASE_E2E,
};
