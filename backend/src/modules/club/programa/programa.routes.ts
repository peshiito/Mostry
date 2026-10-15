import { Router, type RequestHandler } from 'express';
import { tiendaDelPanel } from '../../../shared/http/contextoPanel.js';
import { guardarPrograma, prenderPrograma, verPrograma } from './programa.service.js';
import { esquemaActivo, esquemaPrograma } from './schemas.js';

const ver: RequestHandler = async (req, res) => {
  res.json(await verPrograma(tiendaDelPanel(req)));
};
const guardar: RequestHandler = async (req, res) => {
  const p = esquemaPrograma.parse(req.body);
  res.json(await guardarPrograma(tiendaDelPanel(req), p));
};
const prender: RequestHandler = async (req, res) => {
  const { activo } = esquemaActivo.parse(req.body);
  res.json(await prenderPrograma(tiendaDelPanel(req), activo));
};

// Club de clientes del panel. El acceso (sesión, tienda, suspensión) lo pone
// rutasPanel; el modo soporte del admin no lo monta.
export function rutasClubPanel(): Router {
  const r = Router();
  r.get('/club', ver);
  r.put('/club', guardar);
  r.patch('/club/activo', prender);
  return r;
}
