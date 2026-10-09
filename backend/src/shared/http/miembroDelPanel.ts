import type { Request } from 'express';
import { AppError } from '../errors/AppError.js';

// El usuario del panel que ES miembro de la tienda. En el modo soporte req.panel
// lo completa el admin (que no es miembro): las acciones que son del comercio
// (dar permiso de soporte, mandar un reporte) no se pueden hacer desde ahí.
export function miembroDelPanel(req: Request): number {
  if (!req.panel || req.soporte) {
    throw new AppError(403, 'solo_comercio', 'Esto lo puede hacer solo el comercio.');
  }
  return req.panel.usuarioId;
}
