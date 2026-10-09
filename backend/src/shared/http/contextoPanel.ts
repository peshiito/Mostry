import type { Request } from 'express';
import type { TiendaId } from '../db/tiendaId.js';

// La tienda de una ruta del PANEL: solo existe después de requerirMiembro (el
// usuario es miembro de esa tienda) o de accesoSoporte (permiso vigente que dio
// el comercio). Si una ruta del panel se monta sin esa
// verificación, falla con 500 en el primer test en vez de operar sobre la tienda
// del Origin sin control (IDOR, CLAUDE.md 4.1).
export function tiendaDelPanel(req: Request): TiendaId {
  if (!req.panel) throw new Error('Ruta del panel sin requerirMiembro');
  return req.panel.tiendaId;
}
