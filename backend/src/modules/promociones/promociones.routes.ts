import { tiendaDelPanel } from '../../shared/http/contextoPanel.js';
import { Router, type RequestHandler } from 'express';
import {
  esquemaEditarPromocion,
  esquemaId,
  esquemaNuevaPromocion,
} from './promociones.schemas.js';
import {
  crearPromocion,
  editarPromocion,
  listarPromociones,
} from './promociones.service.js';

const listar: RequestHandler = async (req, res) => {
  res.json(await listarPromociones(tiendaDelPanel(req)));
};
const crear: RequestHandler = async (req, res) => {
  res
    .status(201)
    .json(
      await crearPromocion(tiendaDelPanel(req), esquemaNuevaPromocion.parse(req.body)),
    );
};
const editar: RequestHandler = async (req, res) => {
  const id = esquemaId.parse(req.params.id);
  res.json(
    await editarPromocion(
      tiendaDelPanel(req),
      id,
      esquemaEditarPromocion.parse(req.body),
    ),
  );
};

// Promociones del panel. El acceso (sesión, tienda, suspensión) lo pone rutasPanel.
export function rutasPromociones(): Router {
  const r = Router();
  r.get('/promociones', listar);
  r.post('/promociones', crear);
  r.patch('/promociones/:id', editar);
  return r;
}
