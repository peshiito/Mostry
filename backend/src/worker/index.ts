import cron from 'node-cron';
import { db } from '../shared/db/db.js';
import { crearMailerSmtp } from '../shared/email/mailer.js';
import { logger } from '../shared/logger.js';
import { ZONA_AR } from '../shared/utils/horaArgentina.js';
import { crearTareas } from './tareas.js';

// Proceso aparte de la API (sección 4): corre las tareas programadas.
process.on('uncaughtException', (err) =>
  logger.fatal({ err }, 'Error no capturado en el worker'),
);
process.on('unhandledRejection', (err) =>
  logger.fatal({ err }, 'Promesa rechazada sin manejar en el worker'),
);

const tareas = crearTareas(crearMailerSmtp());

const programadas = tareas.map((t) => {
  const tarea = cron.schedule(
    t.cron,
    async () => {
      try {
        await t.correr();
      } catch (err) {
        // conLock ya loguea los errores de la tarea; esto cubre los de antes
        // (MySQL caído al pedir el lock) para que nada falle en silencio.
        logger.error({ err, tarea: t.nombre }, 'Tarea falló');
      }
    },
    { name: t.nombre, timezone: ZONA_AR, noOverlap: true },
  );
  // Una tarea que todavía corre cuando le toca de nuevo es señal de que se colgó.
  tarea.on('execution:overlap', () =>
    logger.error({ tarea: t.nombre }, 'La tarea anterior sigue corriendo: se saltea'),
  );
  tarea.on('execution:missed', () =>
    logger.warn({ tarea: t.nombre }, 'Se perdió una ejecución programada'),
  );
  return tarea;
});
logger.info({ tareas: tareas.map((t) => `${t.nombre} (${t.cron})`) }, 'Worker iniciado');

function apagar(senal: string) {
  logger.info({ senal }, 'Apagando el worker…');
  for (const p of programadas) void p.stop();
  void db.destroy().finally(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => apagar('SIGTERM'));
process.on('SIGINT', () => apagar('SIGINT'));
