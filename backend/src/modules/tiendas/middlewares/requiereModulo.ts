import type { RequestHandler } from 'express';
import { db } from '../../../shared/db/db.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { tiendaDelPanel } from '../../../shared/http/contextoPanel.js';

type Modulo = 'usaEncargos' | 'usaLibreta' | 'usaGastos';

// Un módulo que la tienda apagó en "Qué uso de Mostry" también se cierra en la
// API (no solo se esconde en el panel). Sus datos no se borran.
export function requiereModulo(modulo: Modulo): RequestHandler {
  return async (req, _res, next) => {
    const t = await db
      .selectFrom('tiendas')
      .select(modulo)
      .where('id', '=', tiendaDelPanel(req))
      .executeTakeFirstOrThrow();
    if (!t[modulo]) {
      throw new AppError(
        403,
        'modulo_apagado',
        'Esta parte de Mostry está apagada en tu tienda.',
      );
    }
    next();
  };
}
