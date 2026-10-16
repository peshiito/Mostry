import { config } from '../../config/env.js';
import type { TiendaId } from '../../shared/db/tiendaId.js';
import { logger } from '../../shared/logger.js';
import { enviarAvisos } from './enviar.js';

// Después de confirmar la transacción: manda los avisos de la tienda al toque,
// sin demorar la respuesta. Si falla, el worker los reintenta. En los tests no
// corre solo (se llama a enviarAvisos a mano, así no hay carreras).
export function despacharAvisos(tiendaId: TiendaId) {
  if (config.NODE_ENV === 'test') return;
  setImmediate(() => {
    enviarAvisos({ tiendaId }).catch((err: unknown) =>
      logger.warn({ err, tiendaId }, 'No se pudieron despachar los avisos'),
    );
  });
}
