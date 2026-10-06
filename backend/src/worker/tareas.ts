import type { Mailer } from '../shared/email/mailer.js';
import { conLock } from './conLock.js';
import { backupBase } from './jobs/backup.js';
import { barrerHuerfanos } from './jobs/barrerHuerfanos.js';
import { borrarComprobantesVencidos } from './jobs/borrarComprobantes.js';
import { cancelarVencidos } from './jobs/cancelarVencidos.js';
import { probarRestauracion } from './jobs/probarRestauracion.js';
import { reintentarBorrados } from './jobs/reintentarBorrados.js';
import { actualizarSuscripciones } from './jobs/suscripciones.js';

// Cada tarea con su horario (cron, hora argentina) y siempre envuelta en
// conLock: aunque haya dos workers, nunca corre dos veces a la vez (sección 6.6).
export function crearTareas(mailer: Mailer) {
  return [
    {
      nombre: 'cancelar-vencidos',
      cron: '*/5 * * * *',
      correr: () => conLock('cancelar-vencidos', () => cancelarVencidos()),
    },
    {
      nombre: 'borrar-comprobantes',
      cron: '*/15 * * * *',
      correr: () => conLock('borrar-comprobantes', () => borrarComprobantesVencidos()),
    },
    {
      nombre: 'reintentar-borrados',
      cron: '*/10 * * * *',
      correr: () => conLock('reintentar-borrados', () => reintentarBorrados()),
    },
    {
      nombre: 'suscripciones',
      cron: '0 9 * * *',
      correr: () => conLock('suscripciones', () => actualizarSuscripciones(mailer)),
    },
    {
      nombre: 'barrer-huerfanos',
      cron: '30 4 * * *',
      correr: () =>
        conLock('barrer-huerfanos', async () => ({
          publico: await barrerHuerfanos({ bucket: 'publico' }),
          privado: await barrerHuerfanos({ bucket: 'privado' }),
        })),
    },
    {
      nombre: 'backup',
      cron: '0 4 * * *',
      correr: () => conLock('backup', () => backupBase()),
    },
    {
      nombre: 'probar-restauracion',
      cron: '0 5 1 * *',
      correr: () => conLock('probar-restauracion', () => probarRestauracion()),
    },
  ];
}
