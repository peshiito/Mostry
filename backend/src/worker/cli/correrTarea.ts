import { db } from '../../shared/db/db.js';
import { crearMailerSmtp } from '../../shared/email/mailer.js';
import { logger } from '../../shared/logger.js';
import { crearTareas } from '../tareas.js';

// Corre UNA tarea del worker ahora, sin esperar su horario (útil para probar).
// Uso: npm run worker:correr -- <nombre>   (ej.: suscripciones, cancelar-vencidos)
const nombre = process.argv[2];
const tareas = crearTareas(crearMailerSmtp());
const tarea = tareas.find((t) => t.nombre === nombre);

try {
  if (!tarea) {
    const nombres = tareas.map((t) => t.nombre).join(', ');
    throw new Error(`Tarea desconocida "${nombre ?? ''}". Opciones: ${nombres}`);
  }
  logger.info({ resultado: await tarea.correr() }, `✔ ${nombre}`);
} catch (err) {
  logger.error({ err }, `Falló la tarea ${nombre ?? ''}`);
  process.exitCode = 1;
} finally {
  await db.destroy();
}
