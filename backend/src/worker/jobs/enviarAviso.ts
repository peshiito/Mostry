import { db } from '../../shared/db/db.js';
import type { Mailer } from '../../shared/email/mailer.js';
import { logger } from '../../shared/logger.js';

type Aviso = { tiendaId: number; asunto: string; texto: string };

// Manda el aviso a los dueños. Devuelve true si le llegó al menos a uno: si no
// llegó a nadie, quien llama desmarca el aviso para reintentarlo mañana.
export async function enviarAviso(mailer: Mailer, a: Aviso): Promise<boolean> {
  const duenos = await db
    .selectFrom('miembrosTienda')
    .innerJoin('usuarios', 'usuarios.id', 'miembrosTienda.usuarioId')
    .select('usuarios.email')
    .where('miembrosTienda.tiendaId', '=', a.tiendaId)
    .where('miembrosTienda.rol', '=', 'dueno')
    .execute();
  let enviados = 0;
  for (const { email } of duenos) {
    try {
      await mailer.enviar({ para: email, asunto: a.asunto, texto: a.texto });
      enviados++;
    } catch (err) {
      logger.error(
        { err, tiendaId: a.tiendaId, asunto: a.asunto },
        'No se pudo mandar un aviso de suscripción',
      );
    }
  }
  return enviados > 0;
}
