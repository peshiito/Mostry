import type { RequestHandler } from 'express';
import { VERSION_LEGAL } from '../../../config/legal.js';
import { db } from '../../../shared/db/db.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { esquemaTerminos } from '../schemas.js';

// S2: el dueño acepta la versión vigente de los términos y la privacidad (la
// hoja del panel). Una versión vieja (pestaña abierta de antes) no cuenta.
export const aceptarTerminos: RequestHandler = async (req, res) => {
  const { version } = esquemaTerminos.parse(req.body);
  if (version !== VERSION_LEGAL)
    throw new AppError(
      409,
      'version_vieja',
      'Los términos cambiaron: recargá la página.',
    );
  await db
    .updateTable('usuarios')
    .set({ terminosVersion: version, terminosAceptadosEn: new Date() })
    .where('id', '=', req.sesion!.usuarioId)
    .execute();
  res.json({ version });
};
