// Carga ../.env si existe (en CI las variables vienen del entorno) y fuerza modo test.
import { existsSync } from 'node:fs';

const archivo = new URL('../../../.env', import.meta.url);
if (existsSync(archivo)) process.loadEnvFile(archivo);
process.env.NODE_ENV = 'test';
process.env.LOG_NIVEL = 'silent';
