import type { Mailer } from '../shared/email/mailer.js';
import { conLock } from './conLock.js';
import { enviarAvisosPendientes } from './jobs/enviarAvisos.js';
import { resumenManana } from './jobs/resumenManana.js';

// Tareas de los avisos al teléfono del comercio (Avisos 1).
export function tareasAvisos(mailer: Mailer) {
  return [
    {
      nombre: 'enviar-avisos',
      cron: '* * * * *',
      correr: () => conLock('enviar-avisos', () => enviarAvisosPendientes()),
    },
    {
      nombre: 'resumen-manana',
      cron: '*/15 * * * *',
      correr: () => conLock('resumen-manana', () => resumenManana(mailer)),
    },
  ];
}
