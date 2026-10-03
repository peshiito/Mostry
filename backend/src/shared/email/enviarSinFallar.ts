import { logger } from '../logger.js';
import type { Email, Mailer } from './mailer.js';

// Si el email falla, se loguea pero no se corta el flujo (se puede reenviar).
export async function enviarSinFallar(mailer: Mailer, email: Email): Promise<void> {
  try {
    await mailer.enviar(email);
  } catch (err) {
    logger.error({ err, asunto: email.asunto }, 'No se pudo enviar el email');
  }
}
