import { crearApp } from './app.js';
import { config } from './config/env.js';
import { db, pingDb } from './shared/db/db.js';
import { logger } from './shared/logger.js';

const app = crearApp({ pingDb });

const servidor = app.listen(config.PUERTO, () => {
  logger.info(`API escuchando en http://localhost:${config.PUERTO}`);
});

// Apagado prolijo: deja terminar las requests en curso y cierra el pool.
function apagar(senal: string): void {
  logger.info({ senal }, 'Apagando la API…');
  servidor.close(() => {
    void db.destroy().finally(() => process.exit(0));
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => apagar('SIGTERM'));
process.on('SIGINT', () => apagar('SIGINT'));
