import { tiendaDelPanel } from '../../../shared/http/contextoPanel.js';
import type { RequestHandler } from 'express';
import type { Mailer } from '../../../shared/email/mailer.js';
import { esquemaCobro } from '../schemas.js';
import { cambiarCobro } from '../servicios/cobro.service.js';

export function cobroController(mailer: Mailer): RequestHandler {
  return async (req, res) => {
    const datos = esquemaCobro.parse(req.body);
    res.json(
      await cambiarCobro(tiendaDelPanel(req), req.sesion!.usuarioId, datos, mailer),
    );
  };
}
